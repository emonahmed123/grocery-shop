import "server-only";

import { httpClient } from "@/lib/axios/httpClient";
import type { z } from "zod";
import type { placeOrderZodSchema } from "@/zod/order.validation";

const ORDER_ENDPOINTS = {
  create: "/bookings",
};

export type PlacedOrder = {
  id: string;
  totalAmount: number;
};

/** Places the order for the logged-in customer; the backend prices it and takes the stock. */
export async function createOrder(payload: z.output<typeof placeOrderZodSchema>): Promise<PlacedOrder> {
  const response = await httpClient.post<{ _id: string; totalAmount: number }>(ORDER_ENDPOINTS.create, payload);
  return { id: response.data._id, totalAmount: response.data.totalAmount };
}
