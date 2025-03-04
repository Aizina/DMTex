import { createSlice } from '@reduxjs/toolkit';
import { ProductProps } from '../../types';
import { fetchProducts } from './productsAPI';

interface ProductsState {
  items: Record<number, ProductProps[]>; // Данные по страницам
  currentPage: number; // Текущая страница
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProductsState = {
  items: {},
  currentPage: 1,
  status: 'idle',
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { page, data } = action.payload;
        state.items[page] = data; // Храним данные по страницам
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { setPage } = productsSlice.actions;
export default productsSlice.reducer;
