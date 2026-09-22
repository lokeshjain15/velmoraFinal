import productModel from "../models/product.model.js";

export const stockOfProduct = async (productId) => {
  const product = await productModel.findById(productId).select("stock");
  return product?.stock ?? 0;
};
