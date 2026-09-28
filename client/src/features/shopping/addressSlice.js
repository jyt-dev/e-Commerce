import { createSlice } from '@reduxjs/toolkit';
import { fetchAddresses, addAddress, updateAddress, deleteAddress } from './addressThunk';

const initialState = {
    isLoading: false,
    addressList: [],
    error: null,
};

const addressSlice = createSlice({
    name: 'addresses',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchAddresses
            .addCase(fetchAddresses.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAddresses.fulfilled, (state, action) => {
                state.isLoading = false;
                // aggregatePaginate wraps results in data.docs; plain array also handled
                const payload = action.payload?.data;
                if (Array.isArray(payload)) {
                    state.addressList = payload;
                } else if (payload?.docs && Array.isArray(payload.docs)) {
                    state.addressList = payload.docs;
                }
                // If payload shape is unexpected, keep existing list intact
            })
            .addCase(fetchAddresses.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                // Do NOT wipe addressList — keep whatever is already in state
                // so locally added addresses remain visible if the server fetch fails
            })
            // addAddress
            .addCase(addAddress.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addAddress.fulfilled, (state, action) => {
                state.isLoading = false;
                // Assuming it returns the added address or list
                if (action.payload.data && !Array.isArray(action.payload.data)) {
                    state.addressList.push(action.payload.data);
                } else if (Array.isArray(action.payload.data)) {
                    state.addressList = action.payload.data;
                }
            })
            .addCase(addAddress.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // updateAddress
            .addCase(updateAddress.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateAddress.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.data && !Array.isArray(action.payload.data)) {
                    const index = state.addressList.findIndex(addr => addr._id === action.payload.data._id);
                    if (index !== -1) {
                        state.addressList[index] = action.payload.data;
                    }
                } else if (Array.isArray(action.payload.data)) {
                    state.addressList = action.payload.data;
                }
            })
            .addCase(updateAddress.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // deleteAddress
            .addCase(deleteAddress.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.isLoading = false;
                state.addressList = state.addressList.filter(addr => addr._id !== action.payload.addressId);
            })
            .addCase(deleteAddress.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export default addressSlice.reducer;
