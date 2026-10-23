/** One line of an order, as it was priced when the order was placed. */
export interface OrderItem {
  productId: string;
  name: string;
  image?: string;
  unit?: string;
  variation?: string;
  price?: number;
  quantity?: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  subTotal?: number;
  deliveryFee?: number;
  totalAmount: number;
  /** pending, confirmed, shipped, delivered or cancelled. */
  status: string;
  paymentMethod?: string;
  shippingAddress?: { district: string; address: string; phone: string };
  createdAt?: string;
}
