import "server-only";

import { httpClient } from "@/lib/axios/httpClient";
import { type BackendUser, toAuthUser } from "@/services/auth.services";
import type { Order } from "@/types/order.types";
import type { IChangePasswordPayload, IProfilePayload } from "@/zod/account.validation";

// Backend contract for the account pages, kept in one place like auth.services.
const ACCOUNT_ENDPOINTS = {
  myOrders: "/bookings/user",
  updateProfile: "/auth/change",
  // Not on the backend yet; the form reports that clearly until it exists.
  changePassword: "/auth/change-password",
};

type BackendOrder = {
  _id: string;
  products?: { _id: string; name: string; image?: string }[];
  quantity: number;
  totalAmount: number;
  status?: string;
  createdAt?: string;
};

const toOrder = (order: BackendOrder): Order => ({
  id: order._id,
  products: (order.products ?? []).map((product) => ({
    id: product._id,
    name: product.name,
    image: product.image,
  })),
  quantity: order.quantity,
  totalAmount: order.totalAmount,
  status: order.status ?? "pending",
  createdAt: order.createdAt,
});

/** The logged-in user's orders, newest first. */
export async function getMyOrders() {
  const response = await httpClient.get<BackendOrder[] | null>(ACCOUNT_ENDPOINTS.myOrders);
  return (response.data ?? [])
    .map(toOrder)
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
}

/**
 * The backend saves whatever fields it receives here, so only the fields
 * this form owns are ever sent.
 */
export async function updateProfile({ name }: IProfilePayload) {
  const response = await httpClient.post<BackendUser>(ACCOUNT_ENDPOINTS.updateProfile, { name });
  return toAuthUser(response.data);
}

export async function changePassword({ oldPassword, newPassword }: IChangePasswordPayload) {
  await httpClient.post(ACCOUNT_ENDPOINTS.changePassword, { oldPassword, newPassword });
}
