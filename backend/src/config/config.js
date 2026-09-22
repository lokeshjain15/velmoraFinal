import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in the environment variables");
}

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
}

const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").trim().replace(/\/+$/, "");

// Auto-derive production callback URL if running on Render or FRONTEND_URL is configured for production
const defaultGoogleCallbackUrl = process.env.RENDER_EXTERNAL_URL
    ? `${process.env.RENDER_EXTERNAL_URL.trim().replace(/\/+$/, "")}/api/auth/google/callback`
    : (frontendUrl && !frontendUrl.includes("localhost")
        ? `${frontendUrl}/api/auth/google/callback`
        : "https://velmorafinal-3.onrender.com/api/auth/google/callback");

export const config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
    PORT: Number(process.env.PORT) || 3000,
    FRONTEND_URL: frontendUrl,
    GOOGLE_CALLBACK_URL: (process.env.GOOGLE_CALLBACK_URL || defaultGoogleCallbackUrl).trim().replace(/\/+$/, ""),
    NODE_ENV: process.env.NODE_ENV || "development"
}
