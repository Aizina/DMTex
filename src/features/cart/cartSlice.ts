import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartState } from "../../types";
import { deleteCartItem, fetchCart, submitOrder, updateCart } from "./cartAPI";

const loadCartFromLocalStorage = (): CartState => {
  try {
    const cart = localStorage.getItem("cart");
    return cart
      ? JSON.parse(cart)
      : { items: [], total: 0, status: "idle", error: null };
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
    return { items: [], total: 0, status: "idle", error: null };
  }
};

const saveCartToLocalStorage = (cart: CartState) => {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};


const initialState: CartState = loadCartFromLocalStorage();



const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetchCart cases
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
    // updateCart cases: now the reducer receives the full updated cart
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
    // deleteCartItem cases
    builder
      .addCase(deleteCartItem.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteCartItem.fulfilled, (state, action: PayloadAction<CartState>) => {
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.status = "succeeded";
        state.error = null;
        saveCartToLocalStorage(state);
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Ошибка";
      });
    // submitOrder cases
    builder
      .addCase(submitOrder.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(submitOrder.fulfilled, (state, action: PayloadAction<CartState>) => {
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.status = "succeeded";
        state.error = null;
        saveCartToLocalStorage(state);
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Ошибка";
      });
  },
});

export default cartSlice.reducer;
