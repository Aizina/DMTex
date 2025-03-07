import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ProductProps } from "../../types";

const API_BASE_URL = 'https://skillfactory-task.detmir.team';


export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/products`,
        {
          params: { page, limit, sort: 'title:asc' },
        }
       
      );
      return { data: response.data.data, page };

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || error.message);
      } else if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue('An unknown error occurred');
      }
    }
  }
);


export const fetchProduct = async (id: string): Promise<ProductProps> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    if (response.status !== 200) {
      throw new Error(`Failed to fetch product with ID: ${id}`);
    }
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to fetch product");
  }
};
