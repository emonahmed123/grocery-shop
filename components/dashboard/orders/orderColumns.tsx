import OrderStatusBadge from "@/components/shared/OrderStatusBadge";
import { createDataTableColumns } from "@/components/shared/table/tableFeatures";
import { formatPrice } from "@/lib/assets";
import { formatDate, formatOrderId } from "@/lib/format";
import type { AdminOrder } from "@/types/dashboard.types";

export const ORDER_STATUS_OPTIONS = [
  { label: "Pending", value: "pending" },
  { label: "Delivered", value: "delivered" },
];

const column = createDataTableColumns<AdminOrder>();

// Module scope keeps the column array stable between renders.
export const orderColumns = column.columns([
  column.accessor("id", {
    header: "Order",
    enableSorting: false,
    cell: ({ getValue }) => <span className="font-medium text-foreground">{formatOrderId(getValue())}</span>,
  }),
  column.accessor("customerName", {
    header: "Customer",
    sortFn: "text",
  }),
  column.accessor("createdAt", {
    header: "Date",
    sortFn: "datetime",
    sortUndefined: "last",
    enableGlobalFilter: false,
    cell: ({ getValue }) => <span className="text-muted-foreground">{formatDate(getValue())}</span>,
  }),
  column.accessor("quantity", {
    header: "Items",
    enableGlobalFilter: false,
  }),
  column.accessor("totalAmount", {
    header: "Total",
    enableGlobalFilter: false,
    cell: ({ getValue }) => <span className="font-semibold">{formatPrice(getValue())}</span>,
  }),
  column.accessor("status", {
    header: "Status",
    filterFn: "equalsString",
    enableGlobalFilter: false,
    cell: ({ getValue }) => <OrderStatusBadge status={getValue()} />,
  }),
]);
