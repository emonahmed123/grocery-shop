"use client";

import { CircleCheck, type LucideIcon, PackageCheck, Truck, XCircle } from "lucide-react";
import { useMemo, useState } from "react";

import ConfirmDialog from "@/components/dashboard/ConfirmDialog";
import { ORDER_STATUS_OPTIONS, orderColumns } from "@/components/dashboard/orders/orderColumns";
import OrderDetailsDialog from "@/components/dashboard/orders/OrderDetailsDialog";
import PageHeader from "@/components/dashboard/PageHeader";
import DataTable, { type DataTableActions } from "@/components/shared/table/DataTable";
import { useAdminOrders, useUpdateOrderStatus } from "@/hooks/useDashboard";
import { formatOrderId } from "@/lib/format";
import type { AdminOrder, OrderStatus } from "@/types/dashboard.types";

const NO_ORDERS: AdminOrder[] = [];
const getOrderId = (order: AdminOrder) => order.id;
const ORDER_FILTERS = [{ columnId: "status", label: "Statuses", options: ORDER_STATUS_OPTIONS }];
const NEWEST_FIRST = [{ id: "createdAt", desc: true }];

type StatusChange = {
  /** The status the order must have for this action to show. */
  from: OrderStatus[];
  to: OrderStatus;
  label: string;
  icon: LucideIcon;
  title: string;
  description: string;
  confirmLabel: string;
  destructive?: boolean;
};

// An order moves forward one step at a time; the backend refuses anything else.
const STATUS_CHANGES: StatusChange[] = [
  {
    from: ["pending"],
    to: "confirmed",
    label: "Confirm order",
    icon: CircleCheck,
    title: "Confirm this order?",
    description: "The customer gets an email that the shop is preparing the order.",
    confirmLabel: "Confirm order",
  },
  {
    from: ["confirmed"],
    to: "shipped",
    label: "Mark as shipped",
    icon: Truck,
    title: "Mark this order as shipped?",
    description: "The customer gets an email that the order is on the way.",
    confirmLabel: "Mark shipped",
  },
  {
    from: ["shipped"],
    to: "delivered",
    label: "Mark as delivered",
    icon: PackageCheck,
    title: "Mark this order as delivered?",
    description: "A cash on delivery order is also marked as paid. The customer can then review the products.",
    confirmLabel: "Mark delivered",
  },
  {
    from: ["pending", "confirmed", "shipped"],
    to: "cancelled",
    label: "Cancel order",
    icon: XCircle,
    title: "Cancel this order?",
    description: "The stock goes back to the products and the customer gets an email. This cannot be undone.",
    confirmLabel: "Cancel order",
    destructive: true,
  },
];

// The order stays set while a dialog closes, so its text does not change mid-animation.
type DialogState = { open: boolean; order?: AdminOrder };
type ChangeState = DialogState & { change?: StatusChange };
const CLOSED = { open: false };
const close = <T extends DialogState>(state: T): T => ({ ...state, open: false });

const OrdersManager = () => {
  const { data: orders = NO_ORDERS, isPending, error, refetch } = useAdminOrders();
  const updateStatus = useUpdateOrderStatus();

  const [viewing, setViewing] = useState<DialogState>(CLOSED);
  const [changing, setChanging] = useState<ChangeState>(CLOSED);

  const waitingCount = orders.filter((order) => order.status === "pending").length;

  const actions = useMemo<DataTableActions<AdminOrder>>(
    () => ({
      onView: (order) => setViewing({ open: true, order }),
      custom: STATUS_CHANGES.map((change) => ({
        label: change.label,
        icon: change.icon,
        isVisible: (order: AdminOrder) => change.from.includes(order.status as OrderStatus),
        onSelect: (order: AdminOrder) => setChanging({ open: true, order, change }),
      })),
    }),
    [],
  );

  const { order, change } = changing;

  return (
    <>
      <PageHeader
        title="All Orders"
        description={isPending ? "Loading orders..." : `${orders.length} orders · ${waitingCount} waiting for confirmation`}
      />

      <DataTable
        data={orders}
        columns={orderColumns}
        getRowId={getOrderId}
        actions={actions}
        search={{ placeholder: "Search by customer..." }}
        filters={ORDER_FILTERS}
        initialSorting={NEWEST_FIRST}
        isLoading={isPending}
        error={error?.message}
        onRetry={() => refetch()}
        emptyMessage="No orders found."
      />

      <OrderDetailsDialog
        open={viewing.open}
        onOpenChange={(open) => !open && setViewing(close)}
        order={viewing.order}
      />

      <ConfirmDialog
        open={changing.open}
        onOpenChange={(open) => !open && setChanging(close)}
        title={change?.title ?? ""}
        description={
          <>
            Order <strong className="text-foreground">{order && formatOrderId(order.id)}</strong> for{" "}
            {order?.customerName}. {change?.description}
          </>
        }
        confirmLabel={change?.confirmLabel ?? "Confirm"}
        destructive={change?.destructive}
        isPending={updateStatus.isPending}
        onConfirm={() => {
          if (order && change) {
            updateStatus.mutate({ id: order.id, status: change.to }, { onSuccess: () => setChanging(close) });
          }
        }}
      />
    </>
  );
};

export default OrdersManager;
