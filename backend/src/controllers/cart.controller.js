import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import mongoose from "mongoose";
import { stockOfProduct } from "../dao/product.dao.js";
import { createOrder } from "../services/payment.service.js";
import { getCartDetails } from "../dao/cart.dao.js";
import paymentModel from "../models/payment.model.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import { config } from "../config/config.js";

const getProductAndStock = async (productId) => {
  const product = await productModel.findById(productId);

  if (!product) {
    return null;
  }

  const stock = await stockOfProduct(productId);

  return { product, stock };
};

const cartItemFilter = (userId, productId) => ({
  user: userId,
  items: {
    $elemMatch: {
      product: productId,
    },
  },
});

// Replace the authenticated user's server cart with trusted catalog products.
// Prices and stock always come from MongoDB; client-supplied prices are ignored.
export const syncCart = async (req, res) => {
  const requestedItems = Array.isArray(req.body.items) ? req.body.items : [];

  if (requestedItems.length === 0) {
    return res.status(400).json({ message: "Cart is empty", success: false });
  }

  const normalized = requestedItems.map((item) => {
    const rawCatalogId = item.catalogId !== undefined && item.catalogId !== null && item.catalogId !== ""
      ? Number(item.catalogId)
      : (Number.isInteger(Number(item.id)) && Number(item.id) > 0 && !/^[0-9a-fA-F]{24}$/.test(String(item.id)) ? Number(item.id) : null);

    const rawProductId = item.productId
      ? String(item.productId)
      : (typeof item.id === "string" && /^[0-9a-fA-F]{24}$/.test(item.id) ? item.id : null);

    return {
      catalogId: Number.isInteger(rawCatalogId) && rawCatalogId > 0 ? rawCatalogId : null,
      productId: rawProductId && mongoose.Types.ObjectId.isValid(rawProductId) ? rawProductId : null,
      quantity: Number(item.quantity),
    };
  });

  if (normalized.some((item) =>
    (!Number.isInteger(item.catalogId) && !mongoose.Types.ObjectId.isValid(item.productId)) ||
    !Number.isInteger(item.quantity) || item.quantity < 1
  )) {
    return res.status(400).json({ message: "Invalid cart items", success: false });
  }

  const catalogIds = normalized.filter((item) => Number.isInteger(item.catalogId)).map((item) => item.catalogId);
  const productIds = normalized.filter((item) => mongoose.Types.ObjectId.isValid(item.productId)).map((item) => item.productId);
  const products = await productModel.find({ $or: [
    { catalogId: { $in: catalogIds } },
    { _id: { $in: productIds } },
  ] });
  const productByCatalogId = new Map(products.map((product) => [product.catalogId, product]));
  const productById = new Map(products.map((product) => [String(product._id), product]));

  if (normalized.some((item) =>
    !(Number.isInteger(item.catalogId) ? productByCatalogId.get(item.catalogId) : productById.get(item.productId))
  )) {
    return res.status(400).json({ message: "One or more products are unavailable", success: false });
  }

  const items = normalized.map(({ catalogId, productId, quantity }) => {
    const product = Number.isInteger(catalogId) ? productByCatalogId.get(catalogId) : productById.get(productId);
    if (quantity > product.stock) {
      const error = new Error(`Only ${product.stock} items left in stock for ${product.title}`);
      error.status = 400;
      throw error;
    }
    return { product: product._id, quantity, price: product.price };
  });

  const cart = await cartModel.findOneAndUpdate(
    { user: req.user._id },
    { $set: { items }, $setOnInsert: { user: req.user._id } },
    { upsert: true, returnDocument: "after" },
  ).populate("items.product");

  return res.status(200).json({ message: "Cart synchronized", success: true, cart });
};

//add a product to the cart of the user
export const addToCart = async (req, res) => {
  const { productId } = req.params;
  const { quantity = 1 } = req.body;

  const productDetails = await getProductAndStock(productId);

  if (!productDetails) {
    return res.status(404).json({
      message: "Product not found",
      success: false,
    });
  }

  const { product, stock } = productDetails;

  const cart =
    (await cartModel.findOne({ user: req.user._id })) ||
    (await cartModel.create({ user: req.user._id }));

  const isProductAlreadyInCart = cart.items.some(
    (item) => item.product.toString() === productId,
  );

  if (isProductAlreadyInCart) {
    const quantityInCart = cart.items.find((item) =>
      item.product.toString() === productId,
    ).quantity;
    if (quantityInCart + quantity > stock) {
      return res.status(400).json({
        message: `only ${stock} items left in stock. and you already have ${quantityInCart} items in your cart`,
        success: false,
      });
    }

    const updatedCart = await cartModel.findOneAndUpdate(
      cartItemFilter(req.user._id, productId),
      { $inc: { "items.$.quantity": quantity } },
      { new: true },
    );

    return res.status(200).json({
      message: "cart updated successfully",
      success: true,
      cart: updatedCart,
    });
  }

  if (quantity > stock) {
    return res.status(400).json({
      message: `only ${stock} items left in stock`,
      success: false,
    });
  }

  cart.items.push({
    product: productId,
    quantity,
    price: product.price,
  });

  const updatedCart = await cart.save();

  return res.status(200).json({
    message: "Product added to cart successfully",
    success: true,
    cart: updatedCart,
  });

};

// get all the items in the cart of the user
export const getCart = async (req, res) => {
  const user = req.user;

  let cart = await cartModel
    .findOne({ user: user._id })
    .populate("items.product");

  if (!cart) {
    cart = await cartModel.create({ user: user._id });
  }

  return res.status(200).json({
    message: "Cart fetched successfully",
    success: true,
    cart,
  });
};

// increment the quantity of a product in the cart of the user
export const incrementCartItemQuantity = async (req, res) => {

  const { productId } = req.params;
  const productDetails = await getProductAndStock(productId);

  if(!productDetails){
        return res.status(404).json({
            message: "Product not found",
            success: false,
        });
    }

      const cart = await cartModel.findOne({ user: req.user._id });

    if(!cart){
        return res.status(404).json({
            message: "Cart not found",
            success: false,
        });
    }
          
    const stock = productDetails.stock;

    const itemQuantityInCart = cart.items.find(item =>
      item.product.toString() === productId,
    )?.quantity || 0;
    
    if(itemQuantityInCart + 1 > stock){
      return res.status(400).json({
        message: `only ${stock} items left in stock. and you already have ${itemQuantityInCart} items in your cart`,
        success: false,
      });
    }

    const updatedCart = await cartModel.findOneAndUpdate(
      cartItemFilter(req.user._id, productId),
      { $inc: { "items.$.quantity": 1 } },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).json({
        message: "Item not found in cart",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Cart item quantity incremented successfully",
      success: true,
      cart: updatedCart,
    });

};    

// decrement the quantity of a product in the cart of the user
export const decrementCartItemQuantity = async (req, res) => {

  const { productId } = req.params;

  const cart = await cartModel.findOne({ user: req.user._id });

  if(!cart){
    return res.status(404).json({
      message: "Cart not found",
      success: false,
    });
  }

  const item = cart.items.find(item =>
    item.product.toString() === productId,
  );

  if(!item){
    return res.status(404).json({
      message: "Item not found in cart",
      success: false,
    });
  }

  if(item.quantity <= 1){
    return res.status(400).json({
      message: "Item quantity cannot be less than 1",
      success: false,
    });
  }

  const updatedCart = await cartModel.findOneAndUpdate(
    cartItemFilter(req.user._id, productId),
    { $inc: { "items.$.quantity": -1 } },
    { new: true }
  );

  return res.status(200).json({
    message: "Cart item quantity decremented successfully",
    success: true,
    cart: updatedCart,
  });

};    

// remove an item from the cart of the user
export const removeCartItem = async (req, res) => {

  const { productId } = req.params;

  const cart = await cartModel.findOne({ user: req.user._id });

  if(!cart){
    return res.status(404).json({
      message: "Cart not found",
      success: false,
    });
  }

  const itemIndex = cart.items.findIndex(item =>
    item.product.toString() === productId,
  );

  if(itemIndex === -1){ 
    return res.status(404).json({
      message: "Item not found in cart",
      success: false,
    });
  }

  cart.items.splice(itemIndex, 1);
  const updatedCart = await cart.save();

  return res.status(200).json({
    message: "Cart item removed successfully",
    success: true,
    cart: updatedCart,
  });

};

// clear the cart of the user
export const createOrderController = async (req, res) => {
  const cart = await getCartDetails(req.user._id);

    if (!cart || cart.items.length === 0) {
        return res.status(400).json({
      message: "Cart is empty",
      success: false,
    });
    }

  for (const item of cart.items) {
    const stock = await stockOfProduct(item.product._id);

    if (item.quantity > stock) {
      return res.status(400).json({
        message: `Only ${stock} items left in stock for ${item.product.title}`,
        success: false,
      });
    }
  }

  const order = await createOrder({
    amount: cart.totalPrice,
    currency: cart.currency,
  });

    const payment = await paymentModel.create({
        user: req.user._id,
        razorpay: {
            orderId: order.id,
        },
        price: {
            amount: cart.totalPrice,
            currency: cart.currency
        },
        orderItems: cart.items.map(item => ({
            title: item.product.title,
            productId: item.product._id,
            quantity: item.quantity,
            images: item.product.images,
            description: item.product.description,
            price: item.price,
        }))
        });

    return res.status(200).json({
          message: "Order created successfully",
          success: true,
          order,
          payment,
        });
      };

// verify the order of the user
export const verifyOrderController = async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    } = req.body

    const payment = await paymentModel.findOne({
        "razorpay.orderId": razorpay_order_id,
        status: "pending"
    });

    if (!payment) {
        return res.status(400).json({
            message: "Payment not found",
            success: false
        });
    }

    if (!config.RAZORPAY_KEY_SECRET) {
        return res.status(503).json({ message: "Payment service is not configured", success: false });
    }

    const isPaymentValid = validatePaymentVerification({
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
    }, razorpay_signature, config.RAZORPAY_KEY_SECRET);

    if (!isPaymentValid) {
        payment.status = "failed"
        await payment.save();

        return res.status(400).json({
            message: "Payment verification failed",
            success: false
        });
    }

      const completePayment = async (session = null) => {
        const paymentQuery = paymentModel.findOne({ _id: payment._id, status: "pending" });
        if (session) paymentQuery.session(session);
        const pendingPayment = await paymentQuery;

        if (!pendingPayment) throw new Error("Payment has already been processed");

        for (const item of pendingPayment.orderItems) {
          const options = session ? { session } : {};
          const result = await productModel.updateOne(
            { _id: item.productId, stock: { $gte: item.quantity } },
            { $inc: { stock: -item.quantity } },
            options,
          );
          if (result.modifiedCount !== 1) throw new Error(`Insufficient stock for ${item.title}`);
        }

        pendingPayment.status = "paid";
        pendingPayment.razorpay.paymentId = razorpay_payment_id;
        pendingPayment.razorpay.signature = razorpay_signature;
        await pendingPayment.save(session ? { session } : {});
        await cartModel.updateOne(
          { user: pendingPayment.user },
          { $set: { items: [] } },
          session ? { session } : {},
        );
      };

      const session = await mongoose.startSession();

      try {
        await session.withTransaction(() => completePayment(session));
      } catch (error) {
        const unsupportedTransaction = /Transaction numbers are only allowed|replica set|mongos/i.test(error.message);
        if (unsupportedTransaction) {
          try {
            await completePayment();
          } catch (fallbackError) {
            return res.status(fallbackError.message.startsWith("Insufficient stock") ? 409 : 500).json({
              message: fallbackError.message,
              success: false,
            });
          }
          return res.status(200).json({
            message: "Payment verified successfully",
            success: true,
            orderId: payment.razorpay?.orderId || payment._id,
            payment,
          });
        }

        if (error.message.startsWith("Insufficient stock")) {
          return res.status(409).json({
            message: error.message,
            success: false,
          });
        }

        return res.status(500).json({
          message: "Unable to complete payment verification",
          success: false,
        });
      } finally {
        await session.endSession();
      }

    return res.status(200).json({
      message: "Payment verified successfully",
      success: true,
      orderId: payment.razorpay?.orderId || payment._id,
      payment,
    });
  };
