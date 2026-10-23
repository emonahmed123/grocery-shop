"use client";

import FlashSaleStateBadge from "@/components/dashboard/flash-sale/FlashSaleStateBadge";
import { ProductThumb } from "@/components/dashboard/products/productColumns";
import { createDataTableColumns } from "@/components/shared/table/tableFeatures";
import { formatPrice } from "@/lib/assets";
import { getFlashPrice } from "@/lib/flashSale";
import type { FlashSaleRecord } from "@/types/dashboard.types";

export const dateTimeFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" });

/** "Oct 22, 2026, 9:00 AM – Oct 23, 2026, 9:00 AM", and when it was stopped early. */
export const SalePeriod = ({ record }: { record: FlashSaleRecord }) => (
  <div className="flex flex-col gap-0.5 text-xs">
    <span className="text-foreground">
      {dateTimeFormat.format(new Date(record.startAt))} – {dateTimeFormat.format(new Date(record.endAt))}
    </span>
    {record.closedAt && (
      <span className="text-muted-foreground">
        Stopped {dateTimeFormat.format(new Date(record.closedAt))}
      </span>
    )}
  </div>
);

/** Revenue only counts orders linked to the sale; an older sale's first orders were not. */
export const SaleRevenue = ({ record }: { record: FlashSaleRecord }) => (
  <span className="flex flex-col">
    <span className="font-semibold text-foreground">{formatPrice(record.revenue)}</span>
    {record.isLegacy && <span className="text-xs text-muted-foreground">orders before history not counted</span>}
  </span>
);

const column = createDataTableColumns<FlashSaleRecord>();

// The backend sorts the history (newest first), so columns do not sort.
export const flashSaleHistoryColumns = column.columns([
  column.accessor("productName", {
    header: "Product",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <ProductThumb src={row.original.productImage} />
        <p className="max-w-56 truncate font-medium text-foreground">{row.original.productName}</p>
      </div>
    ),
  }),
  column.accessor("discountPercentage", {
    header: "Discount",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.discountPercentage}% off</span>
        <span className="text-xs text-muted-foreground">
          {formatPrice(getFlashPrice(row.original.regularPrice, row.original.discountPercentage))} instead of{" "}
          {formatPrice(row.original.regularPrice)}
        </span>
      </div>
    ),
  }),
  column.accessor("startAt", {
    header: "Period",
    enableSorting: false,
    cell: ({ row }) => <SalePeriod record={row.original} />,
  }),
  column.accessor("soldCount", {
    header: "Sold",
    enableSorting: false,
    cell: ({ row }) => (
      <span>
        {row.original.soldCount}
        {row.original.quantityLimit ? ` / ${row.original.quantityLimit}` : ""}
        <span className="block text-xs text-muted-foreground">
          {row.original.orderCount} {row.original.orderCount === 1 ? "order" : "orders"}
        </span>
      </span>
    ),
  }),
  column.accessor("revenue", {
    header: "Revenue",
    enableSorting: false,
    cell: ({ row }) => <SaleRevenue record={row.original} />,
  }),
  column.accessor("state", {
    header: "Status",
    enableSorting: false,
    cell: ({ getValue }) => <FlashSaleStateBadge state={getValue()} />,
  }),
]);
