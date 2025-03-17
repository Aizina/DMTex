export interface ProductProps {
    id: string,
    category: string,
    title: string,
    description: string,
    price: number,
    picture: string,
    rating: number
}


export interface CartItemProps {
    id: string;
    title: string;
    picture: string;
    price: number;
    quantity: number;
  }
  
export interface CartState {
    items: CartItemProps[];
    total: number;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}
  
export interface ApiCartItem {
    product: {
        id: string;
        title: string;
        picture: string;
        price: number;
    };
    quantity: number;
}
export interface ItemsInOrders {
    quantity: number;
    createdAt: string;
    product: ProductProps;
}
export interface OrdersProps {
    uniqueId?: string;
  items: {
    quantity: number;
    createdAt: string;
    product: ProductProps;
  }[];
}

export interface OrdersState {
  orders: Record<number, OrdersProps[]>; 
  currentPage: number; 
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  forceRefresh?: boolean; 
}

export interface RawOrder {
    [key: string]: unknown; // <--- index signature so `orderObj[key]` won't complain
    uniqueId?: string;
  }
  