import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { RootState } from "../../app/store";
import apiClient from "../apiClient";
import { OrdersProps } from "../../types";
import { createAsyncThunk } from "@reduxjs/toolkit";

// 1) Add the new RawOrder interface here (or import it if declared elsewhere)
interface RawOrder {
  [key: string]: unknown;
  uniqueId?: string;
}

export const fetchOrders = createAsyncThunk<
  { page: number; data: OrdersProps[] }, // final shape returned to Redux
  { page: number; limit: number },       // arguments
  { state: RootState; rejectValue: string }
>(
  "orders/fetchOrders",
  async ({ page, limit }, { rejectWithValue, getState }) => {
    try {
      const state = getState().orders;

      // If we already have orders for this page and no refresh needed:
      if (state.orders[page] && !state.forceRefresh) {
        return { page, data: state.orders[page] };
      }

      // Otherwise fetch from API
      const response = await apiClient.get("/orders", {
        params: { page, limit, sort: "title:asc" },
      });

      // 2) Cast the incoming data to RawOrder[]
      const rawOrders = response.data.data as RawOrder[];

      // 3) Transform each raw object into your final shape
      const ordersTransformed: OrdersProps[] = rawOrders.map((orderObj) => {
        // If the backend provides a uniqueId, use it; otherwise generate one
        const { uniqueId } = orderObj;

        // Gather all numeric keys as items, ignoring "uniqueId"
        const items = Object.keys(orderObj)
          .filter((key) => key !== "uniqueId")
          .map((key) => orderObj[key]) // no TS error now because of index signature
          .filter(Boolean); // remove undefined just in case

        return {
          // final shape
          uniqueId: (uniqueId as string) ?? uuidv4(),
          // items will be array of unknown, but you can refine if you know the shape
          items: items as [], 
        };
      });
console.log(ordersTransformed)
      return { page, data: ordersTransformed };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Something went wrong.");
      }
      return rejectWithValue("Something went wrong.");
    }
  }
);
