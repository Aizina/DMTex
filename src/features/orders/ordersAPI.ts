import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { RootState } from "../../app/store";
import apiClient from "../apiClient";
import { OrdersProps } from "../../types";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface RawOrder {
  [key: string]: unknown;
  uniqueId?: string;
}

export const fetchOrders = createAsyncThunk<
  { page: number; data: OrdersProps[] }, 
  { page: number; limit: number },   
  { state: RootState; rejectValue: string }
>(
  "orders/fetchOrders",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/orders", {
        params: { page, limit, sort: "title:asc" },
      });

      console.log(apiClient)

      const rawOrders = response.data.data as RawOrder[];
      console.log('response orders', response)

      const ordersTransformed: OrdersProps[] = rawOrders.map((orderObj) => {
        const { uniqueId } = orderObj;

        const items = Object.keys(orderObj)
          .filter((key) => key !== "uniqueId")
          .map((key) => orderObj[key]) 
          .filter(Boolean); 

        return {
          uniqueId: (uniqueId as string) ?? uuidv4(),
          items: items as [], 
        };
      });
      console.log('response orders transformed',ordersTransformed)
      return { page, data: ordersTransformed };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Something went wrong.");
      }
      return rejectWithValue("Something went wrong.");
    }
  }
);
