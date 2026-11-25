import "server-only";

import { cookies } from "next/headers";

import { formatPrice } from "@/lib/assets";
import { formatDate, formatOrderId } from "@/lib/format";
import { AUTH_COOKIES } from "@/lib/tokenUtils";
import { getMyOrders } from "@/services/account.services";
import type { Order } from "@/types/order.types";

// Customers see an order as "#9D0DC6", the last 6 characters of its id
// (formatOrderId); a full 24-character id works too.
const WITH_HASH = /#([0-9a-f]{24}|[0-9a-f]{6})\b/i;
// "order 9d0dc6", "order id: 9D0DC6"; without the # it needs a digit, so
// a word such as "decade" is never taken for an id
const AFTER_ORDER = /\border(?:\s+id)?\s*[:#-]?\s*([0-9a-f]{24}|(?=[a-f]*\d)[0-9a-f]{6})\b/i;

/** The order id the customer asked about, lowercased, or null. */
export function findOrderId(text: string) {
  const match = text.match(WITH_HASH) ?? text.match(AFTER_ORDER);
  return match ? match[1].toLowerCase() : null;
}

const formatStatus = (status: string) => status.charAt(0).toUpperCase() + status.slice(1);

const describeOrder = (order: Order) => {
  const items = order.items
    .map((item) => (item.quantity && item.quantity > 1 ? `${item.name} × ${item.quantity}` : item.name))
    .join(", ");

  return [
    `Here is your order **${formatOrderId(order.id)}**:`,
    `- **Items:** ${items || "—"}`,
    `- **Status:** ${formatStatus(order.status)}`,
    `- **Total:** ${formatPrice(order.totalAmount)}`,
    `- **Placed on:** ${formatDate(order.createdAt)}`,
  ].join("\n");
};

/**
 * The chat reply for an order id. Only the logged-in customer's own orders
 * are searched (the backend's /bookings/user returns nothing else), so
 * someone else's order, or any order when logged out, is "not found".
 */
export async function orderLookupReply(orderId: string) {
  const shownId = orderId.length === 24 ? formatOrderId(orderId) : `#${orderId.toUpperCase()}`;
  const notFound = `Sorry, I couldn't find order **${shownId}**.`;

  const cookieStore = await cookies();
  if (!cookieStore.get(AUTH_COOKIES.accessToken)) {
    return `${notFound} Please log in to check your orders.`;
  }

  let orders: Order[];
  try {
    orders = await getMyOrders();
  } catch {
    // expired session or the backend refused: same answer, nothing revealed
    return `${notFound} Please log in to check your orders.`;
  }

  const order = orders.find((candidate) => {
    const id = candidate.id.toLowerCase();
    return orderId.length === 24 ? id === orderId : id.endsWith(orderId);
  });

  return order ? describeOrder(order) : `${notFound} Please check the order id in **My Account → Orders**.`;
}
