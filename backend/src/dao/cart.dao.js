import cartModel from "../models/cart.model.js";

export async function getCartDetails(userId) {
    const cart = await cartModel
        .findOne({ user: userId })
        .populate("items.product");

    if (!cart || cart.items.length === 0) {
        return null;
    }

    const items = cart.items.map((item) => item.toObject());
    const totalPrice = items.reduce(
        (total, item) => total + item.price.amount * item.quantity,
        0,
    );

    return {
        _id: cart._id,
        user: cart.user,
        items,
        totalPrice,
        currency: items[0].price.currency,
    };
}