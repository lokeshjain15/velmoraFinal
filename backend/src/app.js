import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import feedbackRouter from "./routes/feedback.routes.js";
import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth20";
import {config} from "./config/config.js";
import cors from "cors";
import path from "path";

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const allowedOrigins = [
  config.FRONTEND_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Initialize Passport.js
app.use(passport.initialize());

app.use(express.static(path.join(__dirname, '../public')));

// Configure Google OAuth strategy
if (config.GOOGLE_CLIENT_ID && config.GOOGLE_CLIENT_SECRET) {
  const googleCallbackURL =
    config.GOOGLE_CALLBACK_URL ||
    process.env.GOOGLE_CALLBACK_URL ||
    "http://localhost:3000/api/auth/google/callback";

  passport.use(
    new GoogleStrategy(
      {
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: googleCallbackURL,
      },
      (accessToken, refreshToken, profile, done) => {
        return done(null, profile);
      }
    )
  );
}

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Velmora API is running" });
});

// auth routes
app.use("/api/auth", authRouter);

// product routes
app.use("/api/products", productRouter);

// cart routes
app.use("/api/cart", cartRouter);

// feedback routes
app.use("/api/feedback", feedbackRouter);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((error, req, res, next) => {
  console.error(error);
  if (res.headersSent) return next(error);
  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
});
export default app;
