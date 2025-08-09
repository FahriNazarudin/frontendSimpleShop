import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    data: [], // Daftar products
    loading: false, // Loading state
    error: null, // Error state
  },
  reducers: {
    fetchProductsStart(state) {
      state.loading = true;
      state.error = "";
    },
    fetchProductsSuccess(state, action) {
      state.loading = false;
      state.data = action.payload; // Update data Products
    },
    fetchProductsFailure(state, action) {
      state.loading = false;
      state.error = action.payload; // Set error message
    },
  },
});

export const {
  fetchProductsSuccess,
  fetchProductsStart,
  fetchProductsFailure,
} = productSlice.actions;

export default productSlice.reducer;
