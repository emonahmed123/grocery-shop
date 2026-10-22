"use client";

import { ProductThumb } from "@/components/dashboard/products/productColumns";
import { createDataTableColumns } from "@/components/shared/table/tableFeatures";
import { useNow } from "@/hooks/useNow";
import { formatPrice } from "@/lib/assets";
import { formatTimeLeft } from "@/lib/flashSale";
import type { AdminProduct, FlashSale } from "@/types/dashboard.types";

const SoldProgress = ({ flashSale }: { flashSale?: FlashSale }) => {
  if (!flashSale) return null;
  if (!flashSale.quantityLimit) {
    return <span className="text-muted-foreground">{flashSale.soldCount} sold · no limit</span>;
  }

  const percent = Math.min(100, Math.round((flashSale.soldCount / flashSale.quantityLimit) * 100));
  return (
    <div className="flex w-32 flex-col gap-1.5">
      <span className="text-xs text-muted-foreground">
        {flashSale.soldCount} / {flashSale.quantityLimit} sold
      </span>
      <div className="h-1.5 overflow-hidden rounded-full bg-fill-thumbnail">
        <div
          className="h-full w-(--sold) rounded-full bg-brand"
          style={{ "--sold": `${percent}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
};

const EndsIn = ({ endAt }: { endAt?: string }) => {
  const now = useNow();
  if (!endAt) return null;
  // The exact countdown appears once the browser knows the time.
  return <span className="font-medium text-foreground">{now === null ? "…" : formatTimeLeft(endAt, now)}</span>;
};

const column = createDataTableColumns<AdminProduct>();

// Ids that are backend fields can be sorted by the backend.
export const flashSaleColumns = column.columns([
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
  column.accessor("price", {
    header: "Regular",
    cell: ({ getValue }) => <span className="text-muted-foreground line-through">{formatPrice(getValue())}</span>,
  }),
  column.accessor("currentPrice", {
    header: "Flash Price",
    enableSorting: false,
    cell: ({ getValue }) => <span className="font-semibold text-brand">{formatPrice(getValue())}</span>,
  }),
  column.accessor((product) => product.flashSale?.discountPercentage, {
    id: "flashSale.discountPercentage",
    header: "Discount",
    cell: ({ getValue }) => <span className="font-medium">{getValue()}% off</span>,
  }),
  column.display({
    id: "sold",
    header: "Sold",
    cell: ({ row }) => <SoldProgress flashSale={row.original.flashSale} />,
  }),
  column.accessor((product) => product.flashSale?.endAt, {
    id: "flashSale.endAt",
    header: "Ends In",
    cell: ({ getValue }) => <EndsIn endAt={getValue()} />,
  }),
]);
