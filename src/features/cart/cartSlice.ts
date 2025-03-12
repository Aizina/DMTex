import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartState, OrdersState, OrdersProps } from "../../types";
import { fetchCart, submitOrder, updateCart } from "./cartAPI";
import { loadCartFromLocalStorage, saveCartToLocalStorage } from "../localStorage";
import { loadOrdersFromLocalStorage, saveOrdersToLocalStorage } from "../localStorage";

const initialState: CartState = loadCartFromLocalStorage();

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
        saveCartToLocalStorage(state);
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
        saveCartToLocalStorage(state);
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
      .addCase(submitOrder.fulfilled, (state, action: PayloadAction<{ orderId: string; items: OrdersProps[] }>) => {
        state.items = []; 
        state.total = 0;
        state.status = "succeeded";
        state.error = null;
        saveCartToLocalStorage(state);
    
        const { orderId, items } = action.payload;
    
        const existingOrders: OrdersState = loadOrdersFromLocalStorage();
    
        const updatedOrders = {
          ...existingOrders.items,
          [orderId]: items, 
        };
    
        const updatedOrdersState: OrdersState = {
          items: updatedOrders,
          currentPage: existingOrders.currentPage || 1, 
          status: "succeeded",
          error: null,
        };
    
        saveOrdersToLocalStorage(updatedOrdersState); 
    })
      .addCase(submitOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Ошибка";
      });
  },
});

export default cartSlice.reducer;
