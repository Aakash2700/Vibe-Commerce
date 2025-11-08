// API service for backend communication
const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  category: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  name: string;
  price: number;
  image_url: string;
}

export interface CartResponse {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface Receipt {
  orderId: string;
  timestamp: string;
  customerInfo: {
    name: string;
    email: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  total: number;
  status: string;
}

// Products API
export const productsAPI = {
  getAll: async (): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },
};

// Cart API
export const cartAPI = {
  getCart: async (): Promise<CartResponse> => {
    const response = await fetch(`${API_BASE_URL}/cart`);
    if (!response.ok) throw new Error('Failed to fetch cart');
    return response.json();
  },

  addItem: async (productId: string, qty: number): Promise<CartItem> => {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, qty }),
    });
    if (!response.ok) throw new Error('Failed to add item to cart');
    return response.json();
  },

  updateQuantity: async (id: string, quantity: number): Promise<CartItem> => {
    const response = await fetch(`${API_BASE_URL}/cart/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });
    if (!response.ok) throw new Error('Failed to update quantity');
    return response.json();
  },

  removeItem: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/cart/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to remove item');
  },
};

// Checkout API
export const checkoutAPI = {
  checkout: async (
    cartItems: Array<{ name: string; price: number; quantity: number }>,
    customerInfo: { name: string; email: string }
  ): Promise<Receipt> => {
    const response = await fetch(`${API_BASE_URL}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartItems, customerInfo }),
    });
    if (!response.ok) throw new Error('Checkout failed');
    return response.json();
  },
};
