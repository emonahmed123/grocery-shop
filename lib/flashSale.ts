import type { FlashSale } from "@/types/dashboard.types";

export type FlashSaleStatus = "scheduled" | "live" | "sold-out" | "ended";

/** Same rules as the backend: inside the time window and while units remain. */
export function getFlashSaleStatus(flashSale: FlashSale, now = Date.now()): FlashSaleStatus {
  if (now < Date.parse(flashSale.startAt)) return "scheduled";
  if (now >= Date.parse(flashSale.endAt)) return "ended";
  if (flashSale.quantityLimit && flashSale.soldCount >= flashSale.quantityLimit) return "sold-out";
  return "live";
}

/** Flash price the backend charges: regular price minus the discount, to the cent. */
export const getFlashPrice = (price: number, discountPercentage: number) =>
  Math.round(price * (1 - discountPercentage / 100) * 100) / 100;

/** "2d 4h", "3h 12m", "8m", or "less than a minute". */
export function formatTimeLeft(until: string, now = Date.now()) {
  const minutes = Math.floor((Date.parse(until) - now) / 60_000);
  if (minutes < 1) return "less than a minute";
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  return `${minutes}m`;
}

/** Value for <input type="datetime-local"> in the browser's own time zone. */
export function toDateTimeLocal(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
