import jwt from "jsonwebtoken";
import {config} from "../config/config.js";
import userModel from "../models/user.model.js";

const extractToken = (req) => {
    if (req.cookies?.token) {
        return req.cookies.token;
    }
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && typeof authHeader === "string") {
        return authHeader.replace(/^Bearer\s+/i, "").trim();
    }
    return null;
};

//middleware to authenticate user
export const authenticateUser = async (req, res, next) => {
    const token = extractToken(req);

    if (!token) {
        return res.status(401).json({ message: "Unauthorized access" });
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error during authentication:", error);
        return res.status(401).json({ message: "Unauthorized access" });
    }
};

//middleware to authenticate seller
export const authenticateSeller = async (req, res, next) => {
    const token = extractToken(req);

    if (!token) {
        return res.status(401).json({ message: "Unauthorized access" });
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        if (user.role !== "seller") {
            return res.status(403).json({ message: "Forbidden access" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Error during authentication:", error);
        return res.status(401).json({ message: "Unauthorized access" });
    }
};
