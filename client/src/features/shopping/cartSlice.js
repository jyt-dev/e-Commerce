import { createSlice } from "@reduxjs/toolkit";
import { fetchCart, addToCart, removeFromCart, reduceQuantity } from "./cartThunk";

const initialState = {
    cartData: null,
    isLoading: false,
    error: null,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        clearCartData: (state) => {
            state.cartData = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchCart
            .addCase(fetchCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartData = action.payload.data;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || "Failed to fetch cart";
                state.cartData = null;
            })
            // addToCart
            .addCase(addToCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.isLoading = false;
                // Rely on fetchCart to update the cart data instead of partial data from add
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || "Failed to add to cart";
            })
            // removeFromCart
            .addCase(removeFromCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.isLoading = false;
                // Typically we would fetch the cart again or manually remove it from state.
                // Assuming we can manually remove it if we have the productId.
                if (state.cartData && state.cartData.items) {
                    state.cartData.items = state.cartData.items.filter(
                        (item) => item.productId?._id !== action.payload.productId && item.productId !== action.payload.productId
                    );
                }
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || "Failed to remove from cart";
            })
            // reduceQuantity
            .addCase(reduceQuantity.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(reduceQuantity.fulfilled, (state) => {
                state.isLoading = false;
                // If API returns updated cart in action.payload.data, we can set it.
                // But reduceProductCount controller doesn't return the updated cart object (returns {}).
                // It's better to fetch the cart again if we want to ensure accuracy,
                // but let's assume we re-fetch the cart in the component if needed, or we just rely on fetchCart.
                // For now we do nothing in state update, component can fetchCart again or we can do it here.
            })
            .addCase(reduceQuantity.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || "Failed to reduce quantity";
            });
    },
});

export const { clearCartData } = cartSlice.actions;
export default cartSlice.reducer;
