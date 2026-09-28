import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice.js"
import sellerProductReducer from "../features/seller/productSlice.js"
import productReducer from "../features/shopping/productSlice.js";
import addressReducer from "../features/shopping/addressSlice.js";
import orderReducer from "../features/shopping/orderSlice.js";
import cartReducer from "../features/shopping/cartSlice.js";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        sellerProducts: sellerProductReducer,
        products: productReducer,
        addresses: addressReducer,
        orders: orderReducer,
        cart: cartReducer
    }
})