"use server";

import { getMeAction } from "@/actions/auth.actions";
import { getApiErrorMessage } from "@/lib/axios/httpClient";
import { isAdmin } from "@/lib/roles";
import { createOrder, type PlacedOrder } from "@/services/order.services";
import type { ApiResult } from "@/types/api.types";
import { type IPlaceOrderPayload, placeOrderZodSchema } from "@/zod/order.validation";

export async function placeOrderAction(payload: IPlaceOrderPayload): Promise<ApiResult<PlacedOrder>> {
  // The browser can be bypassed, so validate again on the server.
  const parsed = placeOrderZodSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Please check your order details" };
  }

  let user;
  try {
    user = await getMeAction();
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error, "Could not check your account") };
  }
  if (!user) return { success: false, message: "Please log in to place your order" };
  // The backend only takes orders from customer accounts.
  if (isAdmin(user)) return { success: false, message: "Admin accounts cannot place orders" };

  try {
    const order = await createOrder(parsed.data);
    return { success: true, message: "Order placed successfully", data: order };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error, "Could not place your order") };
  }
}
