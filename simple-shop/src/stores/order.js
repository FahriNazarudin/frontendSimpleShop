import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchOrdersStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchOrdersSuccess(state, action) {
      state.loading = false;
      state.data = Array.isArray(action.payload) ? action.payload : [];
      state.error = null;
    },
    fetchOrdersFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.data = [];
    },
  },
});

export const { fetchOrdersStart, fetchOrdersSuccess, fetchOrdersFailure } =
  orderSlice.actions;

export default orderSlice.reducer;
