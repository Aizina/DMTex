import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchOrders } from './ordersAPI';
import { loadOrdersFromLocalStorage, saveOrdersToLocalStorage } from '../localStorage';
import { OrdersState, OrdersProps } from '../../types';

const initialState: OrdersState = loadOrdersFromLocalStorage();

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    resetOrders: (state) => {
      state.items = {};
      state.currentPage = 1;
      state.status = 'idle';
      state.error = null;
      state.forceRefresh = false;
      saveOrdersToLocalStorage(state);
    },
    refreshOrders: (state) => {
      state.forceRefresh = true; // ✅ Fix: Allows manual refresh
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<{ page: number; data: OrdersProps[] }>) => {
        state.status = 'succeeded';
        state.items[action.payload.page] = action.payload.data;
        state.forceRefresh = false; // ✅ Reset refresh flag
        saveOrdersToLocalStorage(state);
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});


export const { setPage, resetOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
