import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from "@/api/api.js";

const initialState = {
    isLoading: false,
    productList: [],
    error: null
};


export const addProduct = createAsyncThunk(
    "seller/products/add",
    async (productData, thunkAPI) => {
        try {
            // Important: productData must be a FormData object from your component form
            const resp = await api.post('/seller/products/add', productData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return resp.data; // Structure: { success: true, data: { product, images }, message: "..." }
        } catch (error) {
            const msg = error.response?.data?.message || error.message || "Product Creation Failed";
            return thunkAPI.rejectWithValue(msg);
        }
    }
);

export const getProductsBySeller = createAsyncThunk(
    "seller/products",
    async (_, thunkAPI) => {
        try {
            const resp = await api.get('/seller/products');
            return resp.data; // Structure: { success: true, data: [ ...products ], message: "..." }
        } catch (error) {
            const msg = error.response?.data?.message || error.message || "Products Fetching Failed";
            return thunkAPI.rejectWithValue(msg);
        }
    }
);

export const removeProduct = createAsyncThunk(
    "seller/products/remove",
    async (productId, thunkAPI) => {
        try {
            // Pass the targeted id payload to the backend removal route
            const resp = await api.delete(`/seller/products/${productId}`);
            return { resp: resp.data, productId }; // Return ID to helper reducer filtering blocks
        } catch (error) {
            const msg = error.response?.data?.message || error.message || "Product Removal Failed";
            return thunkAPI.rejectWithValue(msg);
        }
    }
);


export const sellerProductSlice = createSlice({
    name: "sellerProducts",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Add Product Handlers
            .addCase(addProduct.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                // Your backend returns: data: { product, images }
                // So we push the newly created product object onto the array
                if (action.payload?.data?.product) {
                    // Combine the product info and image links array into one uniform card payload
                    const newProduct = {
                        ...action.payload.data.product,
                        images: action.payload.data.images.map(img => img.imageUrl)
                    };
                    state.productList.unshift(newProduct); // unshift adds to the top of the list!
                }
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Get Products Handlers
            .addCase(getProductsBySeller.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getProductsBySeller.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                // FIX: Overwrite array state completely instead of using .push()
                state.productList = action.payload.data || []; 
            })
            .addCase(getProductsBySeller.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Remove Product Handlers
            .addCase(removeProduct.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(removeProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                // FIX: Filter out the product by its unique database ID to remove it from the UI row view
                const deletedId = action.payload.productId;
                state.productList = state.productList.filter(product => product._id !== deletedId);
            })
            .addCase(removeProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export default sellerProductSlice.reducer;
