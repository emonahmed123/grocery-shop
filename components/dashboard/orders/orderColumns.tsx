import OrderStatusBadge from "@/components/shared/OrderStatusBadge";
import { createDataTableColumns } from "@/components/shared/table/tableFeatures";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/assets";
import { formatDate, formatOrderId, formatPaymentMethod } from "@/lib/format";
import type { AdminOrder } from "@/types/dashboard.types";

export const ORDER_STATUS_OPTIONS = [
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const formatPaymentStatus = (status: string) => status.charAt(0).toUpperCase() + status.slice(1);

/** "Cash on Delivery" with whether the money has come in yet. */
export const PaymentInfo = ({ order }: { order: AdminOrder }) => (
  <div className="flex flex-col items-start gap-1">
    <span className="text-foreground">{formatPaymentMethod(order.paymentMethod)}</span>
    <Badge variant={order.paymentStatus === "paid" ? "success" : "secondary"}>
      {formatPaymentStatus(order.paymentStatus)}
    </Badge>
  </div>
);

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
  column.accessor("paymentMethod", {
    header: "Payment",
    enableSorting: false,
    enableGlobalFilter: false,
    cell: ({ row }) => <PaymentInfo order={row.original} />,
  }),
  column.accessor("status", {
    header: "Status",
    filterFn: "equalsString",
    enableGlobalFilter: false,
    cell: ({ getValue }) => <OrderStatusBadge status={getValue()} />,
  }),
]);
