import { createAsyncThunk } from "@reduxjs/toolkit";
import {api} from "@/api/api.js";

export const fetchAddresses = createAsyncThunk(
    "addresses/fetchAll",
    async (_, thunkAPI) => {
        try {
            const resp = await api.get('/addresses/');
            return resp.data;
        } catch (error) {
            const msg = error.response?.data || {error: error.message || "Failed to fetch addresses"};
            return thunkAPI.rejectWithValue(msg);
        }
    }
);

export const addAddress = createAsyncThunk(
    "addresses/add",
    async (formData, thunkAPI) => {
        try {
            const resp = await api.post('/addresses/add', formData);
            return resp.data;
        } catch (error) {
            const msg = error.response?.data || {error: error.message || "Failed to add address"};
            return thunkAPI.rejectWithValue(msg);
        }
    }
);

export const updateAddress = createAsyncThunk(
    "addresses/update",
    async ({ addressId, formData }, thunkAPI) => {
        try {
            const resp = await api.patch(`/addresses/${addressId}`, formData);
            return resp.data;
        } catch (error) {
            const msg = error.response?.data || {error: error.message || "Failed to update address"};
            return thunkAPI.rejectWithValue(msg);
        }
    }
);

export const deleteAddress = createAsyncThunk(
    "addresses/delete",
    async (addressId, thunkAPI) => {
        try {
            const resp = await api.delete(`/addresses/${addressId}`);
            // Returning addressId so we can remove it from state easily
            return { addressId, ...resp.data }; 
        } catch (error) {
            const msg = error.response?.data || {error: error.message || "Failed to delete address"};
            return thunkAPI.rejectWithValue(msg);
        }
    }
);
