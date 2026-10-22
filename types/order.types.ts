export interface OrderProduct {
  id: string;
  name: string;
  image?: string;
}

export interface Order {
  id: string;
  products: OrderProduct[];
  quantity: number;
  totalAmount: number;
  /** Usually "pending" or "delivered"; other values from the backend are shown as-is. */
  status: string;
  createdAt?: string;
}
