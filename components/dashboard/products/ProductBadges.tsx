"use client";

import { Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { useNow } from "@/hooks/useNow";
import { formatPrice } from "@/lib/assets";
import { type FlashSaleStatus, getFlashSaleStatus } from "@/lib/flashSale";
import type { AdminProduct, FlashSale } from "@/types/dashboard.types";

const LOW_STOCK = 10;

export const StockBadge = ({ stock }: { stock: number | null }) => {
  if (stock === null) return <span className="text-muted-foreground">Not tracked</span>;
  if (stock <= 0) return <Badge variant="destructive">Out of stock</Badge>;
  if (stock < LOW_STOCK) return <Badge variant="warning">Low · {stock}</Badge>;
  return <Badge variant="success">{stock} in stock</Badge>;
};

const FLASH_LABEL: Record<FlashSaleStatus, string> = {
  live: "Flash sale",
  scheduled: "Flash scheduled",
  "sold-out": "Flash sold out",
  ended: "Flash ended",
};

/** Shows the product's flash sale, if any, and whether it is running now. */
export const FlashSaleBadge = ({ flashSale }: { flashSale?: FlashSale }) => {
  const now = useNow();
  if (!flashSale) return null;

  // Until the browser knows the time, show the sale without its status.
  const status = now === null ? null : getFlashSaleStatus(flashSale, now);
  return (
    <Badge variant={status === "live" ? "sale" : "outline"}>
      <Zap data-icon="inline-start" aria-hidden="true" />
      {status ? FLASH_LABEL[status] : "Flash sale"} · {flashSale.discountPercentage}%
    </Badge>
  );
};

/** What the customer pays now, with the regular price struck through when lower. */
export const ProductPrice = ({ product }: { product: AdminProduct }) => {
  const isDiscounted = product.currentPrice < product.price;

  return (
    <div className="flex flex-col">
      <span className={isDiscounted ? "font-semibold text-brand" : "font-semibold"}>
        {formatPrice(product.currentPrice)}
        {product.maxPrice ? ` – ${formatPrice(product.maxPrice)}` : ""}
      </span>
      {isDiscounted && (
        <span className="text-xs text-muted-foreground line-through">{formatPrice(product.price)}</span>
      )}
    </div>
  );
};

export const AvailabilityBadge = ({ isAvailable }: { isAvailable: boolean }) =>
  isAvailable ? <Badge variant="success">Active</Badge> : <Badge variant="outline">Hidden</Badge>;
