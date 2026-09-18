import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrder = async ({ amount, currency = "INR", receipt }) => {
    return await razorpay.orders.create({ amount, currency, receipt });
};

export const verifyRazorpayPayment = ({ orderId, paymentId, signature }) => {
    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");
    return expectedSignature === signature;
};

export const fetchRazorpayPayment = async ({ paymentId }) => {
  return await razorpay.payments.fetch(paymentId);
};

export default razorpay;
