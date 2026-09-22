import mongoose from "mongoose";
import productModel from "../models/product.model.js";
import { uploadFile } from "../services/stroage.service.js";
import catalog from "../data/catalog.js";

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      stock = 0,
      category = "decor",
      material = "",
    } = req.body;

    let price;
    try {
      price =
        typeof req.body.price === "string"
          ? JSON.parse(req.body.price)
          : req.body.price;
    } catch (error) {
      return res.status(400).json({
        message: "Price must be valid JSON",
        success: false,
      });
    }

    const seller = req.user;

    const images = await Promise.all(
      (req.files ?? []).map(async (file) => {
        const uploadedFile = await uploadFile({
          buffer: file.buffer,
          fileName: file.originalname,
        });
        return { url: uploadedFile.url };
      })
    );

    const product = await productModel.create({
      title,
      description,
      price,
      stock: Number(stock),
      category,
      categoryLabel:
        category.charAt(0).toUpperCase() + category.slice(1),
      material,
      images,
      seller: seller._id,
    });

    return res.status(201).json({
      message: "Product created successfully",
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error during product creation:", error);

    return res.status(500).json({
      message: error.message || "Unable to create product",
      success: false,
    });
  }
};

// Update product details by ID
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid product ID",
        success: false,
      });
    }

    // Product must belong to logged-in seller
    const product = await productModel.findOne({
      _id: id,
      seller: req.user._id,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found or you are not authorized to update it",
        success: false,
      });
    }

    // Validate stock
    if (
      req.body.stock !== undefined &&
      (req.body.stock === "" || !Number.isFinite(Number(req.body.stock)))
    ) {
      return res.status(400).json({
        message: "Stock must be a valid number",
        success: false,
      });
    }

    // Parse + validate price
    if (req.body.price !== undefined) {
      let parsedPrice;

      try {
        parsedPrice =
          typeof req.body.price === "string"
            ? JSON.parse(req.body.price)
            : req.body.price;
      } catch (error) {
        return res.status(400).json({
          message: "Price must be valid JSON",
          success: false,
        });
      }

      const priceAmount =
        parsedPrice && typeof parsedPrice === "object"
          ? parsedPrice.amount
          : parsedPrice;

      if (
        priceAmount === undefined ||
        priceAmount === null ||
        priceAmount === "" ||
        !Number.isFinite(Number(priceAmount))
      ) {
        return res.status(400).json({
          message: "Price must be a valid number",
          success: false,
        });
      }

      // Preserve existing currency if none supplied
      if (parsedPrice && typeof parsedPrice === "object") {
        product.price.amount = Number(priceAmount);

        if (parsedPrice.currency !== undefined) {
          product.price.currency = parsedPrice.currency;
        }
      } else {
        product.price.amount = Number(priceAmount);
      }
    }

    // Update normal fields
    if (req.body.title !== undefined) {
      product.title = req.body.title;
    }

    if (req.body.description !== undefined) {
      product.description = req.body.description;
    }

    if (req.body.stock !== undefined) {
      product.stock = Number(req.body.stock);
    }

    if (req.body.category !== undefined) {
      product.category = req.body.category;

      product.categoryLabel =
        req.body.category.charAt(0).toUpperCase() +
        req.body.category.slice(1);
    }

    if (req.body.material !== undefined) {
      product.material = req.body.material;
    }

    // Replace images only when new images are uploaded
    if (req.files && req.files.length > 0) {
      product.images = await Promise.all(
        req.files.map(async (file) => {
          const uploadedFile = await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname,
          });
          return { url: uploadedFile.url };
        })
      );
    }

    await product.save();

    return res.status(200).json({
      message: "Product updated successfully",
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error during product update:", error);

    return res.status(500).json({
      message: "Unable to update product",
      success: false,
    });
  }
};

// Delete product by ID
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid product ID",
        success: false,
      });
    }

    const product = await productModel.findOneAndDelete({
      _id: id,
      seller: req.user._id,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found or you are not authorized to delete it",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Product deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error during product deletion:", error);

    return res.status(500).json({
      message: "Unable to delete product",
      success: false,
    });
  }
};

// Get all products of the seller
export const getProductsSeller = async (req, res) => {
  try {
    const seller = req.user;

    const products = await productModel.find({
      seller: seller._id,
    });

    return res.status(200).json({
      message: "Products retrieved successfully",
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error retrieving seller products:", error);

    return res.status(500).json({
      message: "Unable to retrieve products",
      success: false,
    });
  }
};

// Get all products for buyer
export const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find().sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Products retrieved successfully",
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error retrieving products:", error);

    return res.status(500).json({
      message: "Unable to retrieve products",
      success: false,
    });
  }
};

// Get product details by ID
export const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;

    let product = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await productModel.findById(id);
    }

    if (!product && (/^\d+$/.test(id) || Number.isInteger(Number(id)))) {
      product = await productModel.findOne({ catalogId: Number(id) });
    }

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Product details retrieved successfully",
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error retrieving product details:", error);

    return res.status(500).json({
      message: "Unable to retrieve product details",
      success: false,
    });
  }
};

// Seed sample products directly for the logged-in seller
export const seedSampleProducts = async (req, res) => {
  try {
    const seller = req.user;
    const requestedCount = Number(req.body.count) || 15;
    const count = Math.min(Math.max(1, requestedCount), catalog.length);
    const selectedCatalog = catalog.slice(0, count);

    const operations = selectedCatalog.map((product) => {
      const { catalogId, ...productData } = product;
      return {
        updateOne: {
          filter: {
            title: product.title,
            seller: seller._id,
          },
          update: {
            $set: {
              ...productData,
              seller: seller._id,
            },
          },
          upsert: true,
        },
      };
    });

    await productModel.bulkWrite(operations);

    const products = await productModel.find({ seller: seller._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: `Successfully imported ${count} sample products!`,
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error seeding sample products:", error);
    return res.status(500).json({
      message: error.message || "Failed to seed sample products",
      success: false,
    });
  }
};