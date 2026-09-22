import express from "express";
import { createFeedback, getFeedback } from "../controllers/feedback.controller.js";
import { authenticateSeller } from "../middlewares/auth.middlewares.js";

const router = express.Router();

//@route GET /api/feedback
//description: Get submitted feedback
//access Private (Seller only)
router.get("/", authenticateSeller, getFeedback);

//@route POST /api/feedback
//description: Create a new feedback
//access Public
router.post("/", createFeedback);

export default router;
