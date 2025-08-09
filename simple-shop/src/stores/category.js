import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
  name: "category",
  initialState: {
    data: [], // Daftar products
    loading: false, // Loading state
    error: null, // Error state
  },
  reducers: {
    fetchCategoriesStart(state) {
      state.loading = true;
      state.error = "";
    },
    fetchCategoriesSuccess(state, action) {
      state.loading = false;
      state.data = action.payload; // Update data Products
    },
    fetchCategoriesFailure(state, action) {
      state.loading = false;
      state.error = action.payload; // Set error message
    },
  },
});

export const { fetchCategoriesStart, fetchCategoriesSuccess, fetchCategoriesFailure } =
  categorySlice.actions;

export default categorySlice.reducer;
