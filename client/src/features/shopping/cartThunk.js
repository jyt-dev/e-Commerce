import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/api/api.js";

export const fetchCart = createAsyncThunk(
    "cart/fetchCart",
    async (_, thunkAPI) => {
        try {
            const resp = await api.get("/cart/");
            return resp.data;
        } catch (error) {
            const msg = error.response?.data || { error: error.message || "Failed to fetch cart" };
            return thunkAPI.rejectWithValue(msg);
        }
    }
);

export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async ({ productId, quantity }, thunkAPI) => {
        try {
            const resp = await api.post(`/cart/${productId}`, { qt: quantity });
            return resp.data;
        } catch (error) {
            const msg = error.response?.data || { error: error.message || "Failed to add to cart" };
            return thunkAPI.rejectWithValue(msg);
        }
    }
);

export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",
    async (productId, thunkAPI) => {
        try {
            const resp = await api.delete(`/cart/${productId}`);
            return { productId, ...resp.data };
        } catch (error) {
            const msg = error.response?.data || { error: error.message || "Failed to remove from cart" };
            return thunkAPI.rejectWithValue(msg);
        }
    }
);

export const reduceQuantity = createAsyncThunk(
    "cart/reduceQuantity",
    async ({ productId, quantity }, thunkAPI) => {
        try {
            const resp = await api.patch(`/cart/${productId}`, { qt: quantity });
            return resp.data;
        } catch (error) {
            const msg = error.response?.data || { error: error.message || "Failed to reduce quantity" };
            return thunkAPI.rejectWithValue(msg);
        }
    }
);
