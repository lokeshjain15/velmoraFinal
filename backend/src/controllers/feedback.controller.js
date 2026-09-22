import feedbackModel from "../models/feedback.model.js";

export const getFeedback = async (req, res) => {
  try {
    const feedback = await feedbackModel.find().sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Feedback retrieved successfully",
      success: true,
      feedback,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to retrieve feedback",
      success: false,
    });
  }
};

export const createFeedback = async (req, res) => {
  try {
    const feedback = await feedbackModel.create({
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      subject: req.body.subject,
      message: req.body.message,
    });

    return res.status(201).json({
      message: "Feedback submitted successfully",
      success: true,
      feedback,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid feedback details",
        success: false,
        errors: Object.values(error.errors).map(({ message }) => message),
      });
    }

    return res.status(500).json({
      message: "Unable to submit feedback",
      success: false,
    });
  }
};
