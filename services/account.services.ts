import "server-only";

import { httpClient } from "@/lib/axios/httpClient";
import { type BackendUser, toAuthUser } from "@/services/auth.services";
import type { AuthTokens } from "@/types/auth.types";
import type { Order } from "@/types/order.types";
import type { IChangePasswordPayload, IProfilePayload } from "@/zod/account.validation";

// Backend contract for the account pages, kept in one place like auth.services.
const ACCOUNT_ENDPOINTS = {
  myOrders: "/bookings/user",
  updateProfile: "/auth/change",
  changePassword: "/auth/change-password",
};

type BackendOrder = {
  _id: string;
  /** Current backend: a copy of each product line. */
  items?: {
    product: string;
    name: string;
    image?: string;
    unit?: string;
    variation?: string;
    price: number;
    quantity: number;
  }[];
  /** Older orders: products only, with one quantity for the order. */
  products?: { _id: string; name: string; image?: string }[];
  subTotal?: number;
  deliveryFee?: number;
  totalAmount: number;
  status?: string;
  paymentMethod?: string;
  shippingAddress?: { district: string; address: string; phone: string };
  createdAt?: string;
};

const toOrder = (order: BackendOrder): Order => ({
  id: order._id,
  items: order.items
    ? order.items.map((item) => ({
        productId: item.product,
        name: item.name,
        image: item.image,
        unit: item.unit,
        variation: item.variation,
        price: item.price,
        quantity: item.quantity,
      }))
    : (order.products ?? []).map((product) => ({ productId: product._id, name: product.name, image: product.image })),
  subTotal: order.subTotal,
  deliveryFee: order.deliveryFee,
  totalAmount: order.totalAmount,
  status: order.status ?? "pending",
  paymentMethod: order.paymentMethod,
  shippingAddress: order.shippingAddress,
  createdAt: order.createdAt,
});

/** The logged-in user's orders, newest first. */
export async function getMyOrders() {
  // Older backends sent `{ meta, result }` as the data; newer ones send the list.
  const response = await httpClient.get<BackendOrder[] | { result?: BackendOrder[] } | null>(
    ACCOUNT_ENDPOINTS.myOrders,
    { params: { limit: 100, sort: "-createdAt" } },
  );
  const orders = Array.isArray(response.data) ? response.data : (response.data?.result ?? []);
  return orders.map(toOrder).sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
}

/**
 * The backend saves whatever fields it receives here, so only the fields
 * this form owns are ever sent.
 */
export async function updateProfile({ name }: IProfilePayload) {
  const response = await httpClient.post<BackendUser>(ACCOUNT_ENDPOINTS.updateProfile, { name });
  return toAuthUser(response.data);
}

/**
 * The backend rejects tokens issued before a password change, so it answers
 * with a fresh pair that must replace the cookies.
 */
export async function changePassword({ oldPassword, newPassword }: IChangePasswordPayload) {
  const response = await httpClient.post<AuthTokens>(ACCOUNT_ENDPOINTS.changePassword, {
    oldPassword,
    newPassword,
  });
  return response.data;
}
