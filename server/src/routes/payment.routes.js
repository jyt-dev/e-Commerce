import { Router } from "express";

import {
    createPaymentOrder,
    verifyPayment,
    razorpayWebhook
} from "../controllers/payment.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Webhook endpoint (Must be accessible by Razorpay servers, so no JWT)
router.post("/webhook", razorpayWebhook);

router.use(verifyJWT);

// Create Razorpay order for an existing PENDING order
router.post("/orders/:orderId", createPaymentOrder);

// Verify Razorpay payment after frontend checkout and update details in payment and order db
router.post("/verify", verifyPayment);

export default router;