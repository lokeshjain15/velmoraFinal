import mongoose from "mongoose";
import dns from "node:dns";
import { config } from "./config.js";

// Ensure Atlas mongodb+srv SRV DNS lookups succeed reliably across local ISPs/Windows resolvers
try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (error) {
    console.warn("Unable to set custom DNS servers, using default resolver:", error.message);
}

// Function to connect to the MongoDB database
const connectDB = async () => {
    const mongoURI = config.MONGO_URI || process.env.MONGO_URI;

    if (!mongoURI) {
        throw new Error("MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
};

export default connectDB;