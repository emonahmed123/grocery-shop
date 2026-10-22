"use client";

import { ImageOff } from "lucide-react";
import Image from "next/image";

import {
  AvailabilityBadge,
  FlashSaleBadge,
  ProductPrice,
  StockBadge,
} from "@/components/dashboard/products/ProductBadges";
import { createDataTableColumns } from "@/components/shared/table/tableFeatures";
import { useCategories } from "@/hooks/useDashboard";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AdminProduct } from "@/types/dashboard.types";

export const ProductThumb = ({ src, className = "size-11" }: { src: string; className?: string }) => (
  <div className={cn("relative shrink-0 overflow-hidden rounded-md border bg-fill-thumbnail", className)}>
    {src ? (
      // Product images come from any host the admin used, so skip optimization.
      <Image src={src} alt="" fill sizes="160px" unoptimized className="object-cover" />
    ) : (
      <ImageOff className="absolute inset-0 m-auto size-4 text-muted-foreground" aria-hidden="true" />
    )}
  </div>
);

/** Products store the category slug; this shows its name. */
export const CategoryName = ({ slug }: { slug: string }) => {
  const { getCategoryName } = useCategories();
  return <>{slug ? getCategoryName(slug) : "—"}</>;
};

const column = createDataTableColumns<AdminProduct>();

// Column ids match the backend's field names, so a sorted column can be sent
// as `sort=<id>` (or `-<id>`). Module scope keeps the array stable.
export const productColumns = column.columns([
  column.accessor("name", {
    header: "Product",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <ProductThumb src={row.original.image} />
        <div className="min-w-0">
          <p className="max-w-56 truncate font-medium text-foreground">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">{row.original.unit || "—"}</p>
        </div>
      </div>
    ),
  }),
  column.accessor("category", {
    header: "Category",
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">
        <CategoryName slug={getValue()} />
      </span>
    ),
  }),
  column.accessor("price", {
    header: "Price",
    cell: ({ row }) => <ProductPrice product={row.original} />,
  }),
  column.accessor("inStock", {
    header: "Stock",
    cell: ({ getValue }) => <StockBadge stock={getValue()} />,
  }),
  column.display({
    id: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1.5">
        <AvailabilityBadge isAvailable={row.original.isAvailable} />
        <FlashSaleBadge flashSale={row.original.flashSale} />
      </div>
    ),
  }),
  column.accessor("createdAt", {
    header: "Added",
    cell: ({ getValue }) => <span className="text-muted-foreground">{formatDate(getValue())}</span>,
  }),
]);
