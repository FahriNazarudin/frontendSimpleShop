import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./product";
import categorySlice from "./category";
import orderSlice from "./order";

const store = configureStore({
  reducer: {
    product: productSlice,
    category : categorySlice,
    order : orderSlice
  },
});

export default store;
