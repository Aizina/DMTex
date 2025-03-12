import { CartState, OrdersState } from "../types";

export const loadCartFromLocalStorage = (): CartState => {
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
  
export const saveCartToLocalStorage = (cart: CartState) => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
};

export const loadOrdersFromLocalStorage = (): OrdersState => {
    try {
        const orders = localStorage.getItem("orders");
        return orders
        ? JSON.parse(orders)
        : { items: [], currentPage: 1, status: "idle", error: null };
    } catch (error) {
        console.error("Error loading cart from localStorage:", error);
        return { items: [], currentPage: 1, status: "idle", error: null };
    }
};
  
export const saveOrdersToLocalStorage = (orders: OrdersState) => {
    try {
        localStorage.setItem("orders", JSON.stringify(orders));
    } catch (error) {
        console.error("Error saving cart to localStorage:", error);
    }
};