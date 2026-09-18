import mongoose from "mongoose";
import { Order } from "../models/order.model.js";
import { Payment } from "../models/payment.model.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createOrder = asyncHandler(async (req, res) => {
    const customerId = req.user._id;
    const { shippingAddress, paymentMethod } = req.body;

    if (!shippingAddress) {
        throw new ApiError(400, "Shipping address is required");
    }

    // Pull the cart with product details populated so we can price/validate stock
    const cart = await Cart.findOne({ customer: customerId }).populate(
        "items.productId"
    );

    if (!cart || cart.items.length === 0) {
        throw new ApiError(400, "Cart is empty");
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
        const product = item.productId;

        if (!product) {
            throw new ApiError(
                404,
                "One of the products in your cart no longer exists"
            );
        }

        if (product.stock < item.quantity) {
            throw new ApiError(400, `Insufficient stock for ${product.name}`);
        }

        totalAmount += product.price * item.quantity;

        orderItems.push({
            productId: product._id,
            quantity: item.quantity,
        });
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const [order] = await Order.create(
            [
                {
                    totalAmount,
                    customer: customerId,
                    orderItems,
                    shippingAddress,
                    status: "PENDING",
                },
            ],
            { session }
        );

        const [payment] = await Payment.create(
            [
                {
                    orderId: order._id,
                    amountPaid: 0,
                    paymentStatus: "WAITING",
                    paymentMethod: paymentMethod || "UPI",
                },
            ],
            { session }
        );

        // Decrement stock for each purchased product
        for (const item of cart.items) {
            await Product.updateOne(
                { _id: item.productId._id },
                { $inc: { stock: -item.quantity } },
                { session }
            );
        }

        // Empty the cart now that the order exists
        cart.items = [];
        await cart.save({ session });

        await session.commitTransaction();

        return res
            .status(201)
            .json(
                new ApiResponse(201, { order, payment }, "Order created successfully")
            );
    } catch (error) {
        await session.abortTransaction();
        throw error instanceof ApiError
            ? error
            : new ApiError(500, "Order creation failed, please try again");
    } finally {
        session.endSession();
    }
});

const getOrders = asyncHandler(async (req, res) => {
    const customer = req.user._id;

    const orders = await Order.find({ customer })
        .populate("orderItems.productId", "name price")
        .populate("shippingAddress")
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

const getOrder = asyncHandler(async (req, res) => {
    const customer = req.user._id;
    const { orderId } = req.params;

    if (!orderId) {
        throw new ApiError(400, "Order id is required");
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new ApiError(400, "Invalid orderId");
    }

    const order = await Order.findOne({ _id: orderId, customer })
        .populate("orderItems.productId", "name price")
        .populate("shippingAddress");

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, order, "Order fetched successfully"));
});

const cancelOrder = asyncHandler(async (req, res) => {
    const customer = req.user._id;
    const { orderId } = req.params;

    if (!orderId) {
        throw new ApiError(400, "Order id is required");
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new ApiError(400, "Invalid orderId");
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const order = await Order.findOne({
            _id: orderId,
            customer
        }).session(session);

        if (!order) {
            throw new ApiError(404, "Order not found");
        }

        if (
            order.status === "CANCELLED" ||
            order.status === "DELIVERED"
        ) {
            throw new ApiError(
                400,
                "You can't cancel delivered or cancelled order"
            );
        }

        const payment = await Payment.findOne({
            orderId: order._id
        }).session(session);

        if (!payment) {
            throw new ApiError(404, "Payment not found");
        }

        order.status = "CANCELLED";
        await order.save({ session });

        for (const item of order.orderItems) {
            await Product.updateOne(
                {
                    _id: item.productId
                },
                {
                    $inc: {
                        stock: item.quantity
                    }
                },
                {
                    session
                }
            );
        }

        if (payment.paymentStatus === "SUCCESSFUL") {

            if (payment.paymentMethod === "COD") {
                // COD hasn't actually been paid yet
                payment.paymentStatus = "WAITING";
            } else {
                // Online payment needs refund
                payment.paymentStatus = "REFUND_INITIATED";
                payment.refundAmount = payment.amountPaid;
            }

            await payment.save({ session });
        }

        await session.commitTransaction();

        const updatedOrder = await Order.findById(order._id)
            .populate("orderItems.productId", "name price")
            .populate("shippingAddress");

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    order: updatedOrder,
                    payment
                },
                "Order cancelled successfully"
            )
        );

    } catch (error) {
        await session.abortTransaction();

        throw error instanceof ApiError
            ? error
            : new ApiError(
                500,
                "Order cancellation failed, please try again"
            );
    } finally {
        await session.endSession();
    }
});



export {
    createOrder,
    getOrders,
    getOrder,
    cancelOrder
}

