import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { OrdersProps } from "../../types";
import { RootState } from "../../app/store";

const API_BASE_URL = 'https://skillfactory-task.detmir.team';

export const fetchOrders = createAsyncThunk<
  { page: number; data: OrdersProps[] },
  { page: number; limit: number },
  { state: RootState; rejectValue: string }
>(
  'orders/fetchOrders',
  async ({ page, limit }, { rejectWithValue, getState }) => {
    try {
      const state = getState().orders;

      if (state.items[page] && !state.forceRefresh) {
        return { page, data: state.items[page] };
      }

      const response = await axios.get(`${API_BASE_URL}/orders`, {
        params: { page, limit, sort: 'title:asc' },
      });

      console.log("Orders response:", response.data);
      return { page, data: response.data };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Ошибка загрузки заказов");
      } else if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue('An unknown error occurred');
      }
    }
  }
);
