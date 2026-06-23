import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    amountPaid: {
        type: Number,
        required: true,
        min: 0
    },
    transacationId: {
        type: String
    },
    paymentStatus: {
        type: String,
        enum: ["WAITING", "SUCCESSFUL", "FAILED"],
        default: "WAITING",
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ["COD","CARD", "UPI"],
        default: "UPI"
    }
},{timestamps: true})