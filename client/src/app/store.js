import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice.js"
import sellerProductReducer from "../features/seller/productSlice.js"
import productReducer from "../features/shopping/productSlice.js";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        sellerProducts: sellerProductReducer,
        products: productReducer
    }
})