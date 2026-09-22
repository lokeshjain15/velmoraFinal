import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, "Full name is required"],
            trim: true,
            minlength: [2, "Full name must contain at least 2 characters"],
            maxlength: [100, "Full name cannot exceed 100 characters"]
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "Please enter a valid email address"
            ]
        },

        phone: {
            type: String,
            trim: true,
            default: null
        },

        subject: {
            type: String,
            required: [true, "Subject is required"],
            enum: {
                values: [
                    "General Inquiry",
                    "Product Inquiry",
                    "Order Related",
                    "Payment Related",
                    "Complaint",
                    "Suggestion",
                    "Other"
                ],
                message: "Please select a valid subject"
            }
        },

        message: {
            type: String,
            required: [true, "Message is required"],
            trim: true,
            minlength: [10, "Message must contain at least 10 characters"],
            maxlength: [2000, "Message cannot exceed 2000 characters"]
        },

    },
    {
        timestamps: true
    }
);

const feedbackModel = mongoose.model("feedback", feedbackSchema);

export default feedbackModel;