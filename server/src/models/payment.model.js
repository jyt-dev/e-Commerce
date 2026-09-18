import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
            unique: true
        },

        amountPaid: {
            type: Number,
            required: true,
            min: 0
        },

        transactionId: {
            type: String,
            unique: true,
            sparse: true
        },

        paymentStatus: {
            type: String,
            enum: [
                "WAITING",
                "SUCCESSFUL",
                "FAILED",
                "REFUND_INITIATED",
                "REFUNDED",
                "REFUND_FAILED"
            ],
            default: "WAITING",
            required: true
        },

        paymentMethod: {
            type: String,
            enum: ["COD", "CARD", "UPI"],
            required: true
        },

        gatewayOrderId: {
            type: String
        },

        gatewayPaymentId: {
            type: String
        },

        gatewaySignature: {
            type: String
        },

        refundId: {
            type: String
        },

        refundAmount: {
            type: Number,
            min: 0
        },

        refundedAt: {
            type: Date
        }
    },
    { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);