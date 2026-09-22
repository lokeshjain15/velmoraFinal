import Razorpay from "razorpay";
import { config } from "../config/config.js";

const getRazorpayClient = () => {
    if (!config.RAZORPAY_KEY_ID || !config.RAZORPAY_KEY_SECRET) {
        throw new Error(
            "RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be defined in the environment variables",
        );
    }

    return new Razorpay({
        key_id: config.RAZORPAY_KEY_ID,
        key_secret: config.RAZORPAY_KEY_SECRET,
    });
};


export const createOrder = async ({ amount, currency = "INR" }) => {
    const options = {
        amount: Math.round(Number(amount) * 100), // amount in the smallest currency unit (paise)
        currency,
    };

    const order = await getRazorpayClient().orders.create(options);

    return order;
};