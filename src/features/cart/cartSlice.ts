import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartState } from "../../types";
import { fetchCart, submitOrder, updateCart } from "./cartAPI";


const initialState: CartState = {
  items: [],
  total: 0,
  status: "idle",
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<CartState>) => {
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Ошибка";
      });

    builder
      .addCase(updateCart.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateCart.fulfilled, (state, action: PayloadAction<CartState>) => {
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(updateCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Ошибка";
      });

    builder
      .addCase(submitOrder.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(submitOrder.fulfilled, (state) => {
        state.items = []; 
        state.total = 0;
        state.status = "succeeded";
        state.error = null;                             
    })
      .addCase(submitOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Ошибка";
      });
  },
});

export default cartSlice.reducer;
