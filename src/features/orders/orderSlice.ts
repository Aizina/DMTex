import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchOrders } from './ordersAPI';
import { OrdersState, OrdersProps } from '../../types';

const initialState: OrdersState = {
  orders: [], 
  currentPage: 1,
  status: 'idle',
  error: null,
  forceRefresh: false,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    resetOrders: (state) => {
      state.orders = [];
      state.currentPage = 1;
      state.status = 'idle';
      state.error = null;
      state.forceRefresh = false;
    },
    refreshOrders: (state) => {
      state.forceRefresh = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<{ page: number; data: OrdersProps[] }>) => {
        state.status = 'succeeded';
        state.orders[action.payload.page] = action.payload.data;
        state.forceRefresh = false;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { setPage, resetOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
