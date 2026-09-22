import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRouter from "./routes/auth.routes.js";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import feedbackRouter from "./routes/feedback.routes.js";
import { config } from "./config/config.js";

// Create __filename and __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();

// Trust reverse proxy (Render, etc.) for HTTPS detection and secure cookies
app.set("trust proxy", 1);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

// Origin normalization helper (trims trailing slashes)
const normalizeOrigin = (url) => (url ? url.trim().replace(/\/+$/, "") : "");

// CORS configuration
const allowedOrigins = [
  normalizeOrigin(config.FRONTEND_URL),
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://velmorafinal-3.onrender.com",
  ...(process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map(normalizeOrigin)
    : []),
].filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) return true; // Allow requests without origin (server-to-server, curl, Postman)
  const normalized = normalizeOrigin(origin);
  if (allowedOrigins.includes(normalized)) return true;
  // Allow any onrender.com subdomain for this project
  if (/^https:\/\/.*\.onrender\.com$/.test(normalized)) return true;
  return false;
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  })
);

// Initialize Passport.js
app.use(passport.initialize());

// Serve files from backend/public
app.use(express.static(path.join(__dirname, "../public")));

// Configure Google OAuth strategy
if (config.GOOGLE_CLIENT_ID && config.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: config.GOOGLE_CALLBACK_URL || process.env.GOOGLE_CALLBACK_URL,
        proxy: true,
      },
      (accessToken, refreshToken, profile, done) => {
        return done(null, profile);
      }
    )
  );
}

// Health-check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Velmora API is running",
  });
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/feedback", feedbackRouter);

// Serve index.html for client-side routing (SPA fallback) on non-API GET requests
app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    const indexPath = path.join(__dirname, "../public/index.html");
    return res.sendFile(indexPath, (err) => {
      if (err) {
        next();
      }
    });
  }
  next();
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

export default app;