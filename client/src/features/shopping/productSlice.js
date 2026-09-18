import { api } from "@/api/api.js";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";



const initialState = {
    productList: [],
    isLoading: false,
    selectedProduct: null,
    error: null
}

export const getProducts = createAsyncThunk(
    "products",  //http://localhost:5173/products?query=shirt&page=1
    async (params = {}, thunkAPI) => {
        try {
            const resp = await api.get('/shop/products', { params }); //http://localhost:8000/api/v1/shop/products?query=shirt
            console.log("Response", resp);
            console.log("Response.data", resp.data);
            // console.log("Response.data.payload".resp.data.payload);
            // console.log("Response.data.data.docs",resp.data.data.docs);
            
            return resp.data;

        } catch (error) {
            const msg = error.response?.data?.message || error.message || "Products Fetching Failed";
            return thunkAPI.rejectWithValue(msg);
        }
    }
);

export const getProductById = createAsyncThunk(
    "product",
    async (productId, thunkAPI) => {
        try {
            const resp = await api.get(`/shop/${productId}`);
            return resp.data;
        } catch (error) {
            const msg = error.response?.data?.message || error.message || "Product Removal Failed";
            return thunkAPI.rejectWithValue(msg);
        }
    }
)

export const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                console.log(action.payload);
                console.log(action.payload.data);
                console.log(action.payload.data.docs);

                state.productList = action.payload.data?.docs || [];
                state.error = null;

            })
            .addCase(getProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(getProductById.pending, (state) => {
                state.isLoading = true;
                state.selectedProduct = null;
                state.error = null;
            })

            .addCase(getProductById.fulfilled, (state, action) => {
                state.isLoading = false;

                state.selectedProduct =
                    action.payload.data || null;

                state.error = null;
            })

            .addCase(getProductById.rejected, (state, action) => {
                state.isLoading = false;
                state.selectedProduct = null;
                state.error = action.payload;
            });
    }
})

export default productSlice.reducer;