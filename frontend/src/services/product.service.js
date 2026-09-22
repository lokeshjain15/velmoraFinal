import { api } from "../features/auth/services/auth.api";

export const normalizeProduct = (product) => {
  if (!product) return null;
  const image =
    product.images?.[0]?.url ||
    (typeof product.image === "string" ? product.image : "") ||
    "";

  return {
    id: product._id || product.id,
    catalogId: product.catalogId,
    productId: product._id || product.id,
    name: product.title || product.name || "Untitled Piece",
    title: product.title || product.name || "Untitled Piece",
    description:
      product.description ||
      "A refined Velmora piece selected for timeless form and everyday living.",
    category: (product.category || "decor").toLowerCase(),
    categoryLabel:
      product.categoryLabel ||
      (product.category
        ? product.category.charAt(0).toUpperCase() + product.category.slice(1)
        : "Decor"),
    material: product.material || "",
    price: Number(product.price?.amount ?? product.price ?? 0),
    stock: product.stock ?? 0,
    image,
    images: product.images || (image ? [{ url: image }] : []),
  };
};

export const fetchProducts = async (params = {}) => {
  const { data } = await api.get("/products", { params });
  const rawList = data?.products || [];
  return rawList.map(normalizeProduct);
};

export const fetchProductDetail = async (id) => {
  const { data } = await api.get(`/products/detail/${id}`);
  return normalizeProduct(data?.product);
};
