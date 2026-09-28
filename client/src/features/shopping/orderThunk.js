import { createAsyncThunk } from "@reduxjs/toolkit";
import {api} from "@/api/api.js";

export const fetchUserOrders = createAsyncThunk(
    "orders/fetchAll",
    async (_, thunkAPI) => {
        try {
            const resp = await api.get('/order/');
            return resp.data;
        } catch (error) {
            const msg = error.response?.data || {error: error.message || "Failed to fetch orders"};
            return thunkAPI.rejectWithValue(msg);
        }
    }
);

export const createNewOrder = createAsyncThunk(
    "orders/createNewOrder",
    async (orderData, thunkAPI) => {
        try {
            const resp = await api.post('/order/', orderData);
            return resp.data;
        } catch (error) {
            const msg = error.response?.data || {error: error.message || "Failed to create order"};
            return thunkAPI.rejectWithValue(msg);
        }
    }
);

export const fetchOrderDetails = createAsyncThunk(
    "orders/fetchOrderDetails",
    async (orderId, thunkAPI) => {
        try {
            const resp = await api.get(`/order/${orderId}`);
            return resp.data;
        } catch (error) {
            const msg = error.response?.data || {error: error.message || "Failed to fetch order details"};
            return thunkAPI.rejectWithValue(msg);
        }
    }
);

export const cancelOrder = createAsyncThunk(
    "orders/cancelOrder",
    async (orderId, thunkAPI) => {
        try {
            const resp = await api.patch(`/order/${orderId}/cancel`);
            return resp.data;
        } catch (error) {
            const msg = error.response?.data || {error: error.message || "Failed to cancel order"};
            return thunkAPI.rejectWithValue(msg);
        }
    }
);

export const createPaymentOrder = createAsyncThunk(
    "orders/createPaymentOrder",
    async (orderId, thunkAPI) => {
        try {
            const resp = await api.post(`/payment/orders/${orderId}`);
            return resp.data;
        } catch (error) {
            const msg = error.response?.data || {error: error.message || "Failed to create payment order"};
            return thunkAPI.rejectWithValue(msg);
        }
    }
);

export const verifyPayment = createAsyncThunk(
    "orders/verifyPayment",
    async (paymentDetails, thunkAPI) => {
        try {
            const resp = await api.post(`/payment/verify`, paymentDetails);
            return resp.data;
        } catch (error) {
            const msg = error.response?.data || {error: error.message || "Failed to verify payment"};
            return thunkAPI.rejectWithValue(msg);
        }
    }
);
