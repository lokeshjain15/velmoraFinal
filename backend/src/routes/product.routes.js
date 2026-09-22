import { Router } from "express";
import multer from "multer";

import { authenticateSeller } from "../middlewares/auth.middlewares.js";
import { createProductValidator } from "../validator/product.validator.js";

import {
  createProduct,
  getProductsSeller,
  getAllProducts,
  getProductDetails,
  updateProduct,
  deleteProduct,
  seedSampleProducts,
} from "../controllers/product.controller.js";

// Multer configuration for product image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

const router = Router();

// @route POST /api/products/seed-sample
// @description Seed sample products for logged-in seller
// @access Private (Seller only)
router.post(
  "/seed-sample",
  authenticateSeller,
  seedSampleProducts
);

// @route POST /api/products
// @description Create a new product
// @access Private (Seller only)
// Maximum 5 images
router.post(
  "/",
  authenticateSeller,
  upload.array("images", 5),
  createProductValidator,
  createProduct
);

// @route GET /api/products/seller
// @description Get products for logged-in seller
// @access Private (Seller only)
router.get(
  "/seller",
  authenticateSeller,
  getProductsSeller
);

// @route PATCH /api/products/:id
// @description Update product - existing integrated endpoint
// @access Private (Seller only)
router.patch(
  "/:id",
  authenticateSeller,
  upload.array("images", 5),
  updateProduct
);

// @route PUT /api/products/update/:id
// @description Update product - latest GitHub-compatible endpoint
// @access Private (Seller only)
router.put(
  "/update/:id",
  authenticateSeller,
  upload.array("images", 5),
  updateProduct
);

// @route DELETE /api/products/:id
// @description Delete product
// @access Private (Seller only)
router.delete(
  "/:id",
  authenticateSeller,
  deleteProduct
);

// @route GET /api/products
// @description Get all products
// @access Public
router.get(
  "/",
  getAllProducts
);

// @route GET /api/products/detail/:id
// @description Get product details by ID
// @access Public
router.get(
  "/detail/:id",
  getProductDetails
);

export default router;