import {createSlice} from '@reduxjs/toolkit'

const intialState = {
    isAuthenticated: false,
    isLoading: false,
    user: null
}

export const authSlice = createSlice({
    name: 'auth',
    intialState,
    reducers: {
        // setUser: (state, action) => {
        //     action.payload
        // }
    }
})

export const {setUser} = authSlice.actions;
export default authSlice.reducer;