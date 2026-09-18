import mongoose from "mongoose";

import { Order } from "../models/order.model.js";
import { Payment } from "../models/payment.model.js";

import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import { createRazorpayOrder, verifyRazorpayPayment, fetchRazorpayPayment  } from "../services/razorpay.service.js";


const createPaymentOrder = asyncHandler(async (req, res) => {

    const customerId = req.user._id;
    const { orderId } = req.params;

    if (!orderId) {
        throw new ApiError(400, "Order id is required");
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new ApiError(400, "Invalid order id");
    }

    const order = await Order.findOne({
        _id: orderId,
        customer: customerId
    });

    if (!order) {
        throw new ApiError(404, "Order not found");
    }


    if (order.status !== "PENDING") {
        throw new ApiError(
            400,
            "Payment cannot be created for this order"
        );
    }


    const payment = await Payment.findOne({
        orderId: order._id
    });

    if (!payment) {
        throw new ApiError(404, "Payment record not found");
    }

    if (payment.paymentStatus === "SUCCESSFUL") {
        throw new ApiError(
            400,
            "Payment has already been completed"
        );
    }

    const razorpayOrder = await createRazorpayOrder({
        amount: order.totalAmount * 100,
        currency: "INR",
        receipt: order._id.toString()
    });


    payment.gatewayOrderId = razorpayOrder.id;

    await payment.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                orderId: order._id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,

                razorpayOrderId: razorpayOrder.id,

                key: process.env.RAZORPAY_KEY_ID
            },
            "Payment order created successfully"
        )
    );
});

const verifyPayment = asyncHandler(async (req, res) => {

    const customerId = req.user._id;

    //returned to frontend by razorpy and then frontend send it to backend server
    const {razorpay_payment_id, razorpay_order_id, razorpay_signature} = req.body;


    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      throw new ApiError(400, "Payment verification details are required");
    }

    const payment = await Payment.findOne({
        gatewayOrderId: razorpay_order_id
    });

    if (!payment) {
      throw new ApiError(404, "Payment record not found");
    }

    const order = await Order.findOne({
        _id: payment.orderId,
        customer: customerId
    });

    if (!order) {
      throw new ApiError(404, "Order not found");
    }
    // It verifies the frontend data send by razorpay against constructed signature through backend data
    // this is necessay before updating the payment db details against any chhed-chhad
    const isValid = verifyRazorpayPayment({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature
    });

    if (!isValid) {
      throw new ApiError(400, "Invalid payment signature");
    }

    if (payment.paymentStatus === "SUCCESSFUL") {
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            order,
            payment,
          },
          "Payment already verified"
        )
      );
    }

    const razorpaypayment = fetchRazorpayPayment({razorpay_payment_id});

    if (razorpaypayment.order_id !== payment.gatewayOrderId) {
      throw new ApiError(400, "Payment does not belong to this order");
    }

    if (razorpaypayment.status !== "captured") {
        throw new ApiError(
            400,
            `Payment is not captured. Current status: ${razorpaypayment.status}`
        );
    }

    const expectedAmount = order.totalAmount * 100;

    if (razorpaypayment.amount !== expectedAmount) {
        throw new ApiError(
            400,
            "Payment amount does not match order amount"
        );
    }


    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      payment.gatewayPaymentId = razorpay_payment_id;

      payment.gatewaySignature = razorpay_signature;

      payment.amountPaid = order.totalAmount;

      payment.paymentStatus = "SUCCESSFUL";

      await payment.save({ session });

      order.status = "CONFIRMED";

      await order.save({ session });

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();

      throw error instanceof ApiError
        ? error
        : new ApiError(500, "Payment verification failed");
    } finally {
      await session.endSession();
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                order,
                payment
            },
            "Payment verified successfully"
        )
    );
});


export {
    createPaymentOrder,
    verifyPayment
};