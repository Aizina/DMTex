import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../apiClient';
import { CartItemProps, CartState, ApiCartItem } from '../../types';

const recalcTotal = (items: CartItemProps[]): number =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const fetchCart = createAsyncThunk<CartState, void, { rejectValue: string }>(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/cart');
      console.log('fetchCart response', response)
      const cartItems: CartItemProps[] = response.data.map((item: ApiCartItem) => ({
        id: item.product.id,
        title: item.product.title,
        picture: item.product.picture,
        price: item.product.price,
        quantity: item.quantity,
      }));
      console.log('Fetched cart items:', cartItems);
      return {
        items: cartItems,
        total: recalcTotal(cartItems),
        status: 'succeeded',
        error: null,
      };
    } catch (error) {
      console.error('Error fetching cart:', error);
      return rejectWithValue('Не удалось загрузить корзину');
    }
  }
);


export const updateCart = createAsyncThunk<
  CartState, CartItemProps | CartItemProps[],
  { state: { cart: CartState }; rejectValue: string }
>(
  'cart/updateCart',
  async (newItemOrItems, { rejectWithValue, getState }) => {
    try {
      const { items } = getState().cart;
      const newItems = Array.isArray(newItemOrItems) ? newItemOrItems : [newItemOrItems];
      let updatedItems = [...items];

      newItems.forEach((newItem) => {
        const existingItem = updatedItems.find((item) => item.id === newItem.id);
        if (existingItem) {
          updatedItems = updatedItems.map((item) =>
            item.id === newItem.id ? { ...item, quantity: newItem.quantity } : item
          ).filter((item) => item.quantity > 0);
        } else if (newItem.quantity > 0) {
          updatedItems.push(newItem);
        }
      });

      console.log('Sending to updateCart:', updatedItems.map((item) => ({ id: item.id, quantity: item.quantity })));
      await apiClient.post('/cart/update', {
        data: updatedItems.map((item) => ({ id: item.id, quantity: item.quantity })),
      });

      return {
        items: updatedItems,
        total: recalcTotal(updatedItems),
        status: 'succeeded',
        error: null,
      };
    } catch (error) {
      console.error('Error updating cart:', error);
      return rejectWithValue('Не удалось обновить корзину');
    }
  }
);


export const submitOrder = createAsyncThunk<
  CartState,
  CartItemProps[], 
  { rejectValue: string }
>(
  'cart/submitOrder',
  async (items, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/cart/submit', {
        data: items.map((item) => ({ id: item.id, quantity: item.quantity })),
      });

      console.log('Server response when post:', response.data);

      if (!Array.isArray(response.data)) {
        throw new Error('Сервер не вернул корректные данные заказа');
      }

      return {
        items: [],
        total: 0,
        status: 'succeeded',
        error: null,
      };
    } catch (error) {
      console.error('Order submission error:', error);
      return rejectWithValue('Ошибка при оформлении заказа');
    }
  }
);
