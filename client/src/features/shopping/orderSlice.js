import { createSlice } from '@reduxjs/toolkit';
import { fetchUserOrders, createNewOrder, fetchOrderDetails, cancelOrder, createPaymentOrder, verifyPayment } from './orderThunk';

const initialState = {
    isLoading: false,
    orderList: [],
    orderDetails: null,
    error: null,
};

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserOrders.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderList = action.payload.data || [];
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.orderList = [];
            })
            .addCase(createNewOrder.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createNewOrder.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(createNewOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchOrderDetails.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchOrderDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderDetails = action.payload.data || action.payload;
            })
            .addCase(fetchOrderDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.orderDetails = null;
            })
            .addCase(cancelOrder.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(cancelOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(createPaymentOrder.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createPaymentOrder.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(createPaymentOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(verifyPayment.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(verifyPayment.fulfilled, (state, action) => {
                state.isLoading = false;
                if (state.orderDetails && state.orderDetails._id === action.payload?.data?.order?._id) {
                    state.orderDetails.status = "CONFIRMED";
                }
            })
            .addCase(verifyPayment.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export default orderSlice.reducer;
