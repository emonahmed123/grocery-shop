"use client";

import { PackageCheck } from "lucide-react";
import { useMemo, useState } from "react";

import ConfirmDialog from "@/components/dashboard/ConfirmDialog";
import { ORDER_STATUS_OPTIONS, orderColumns } from "@/components/dashboard/orders/orderColumns";
import OrderDetailsDialog from "@/components/dashboard/orders/OrderDetailsDialog";
import PageHeader from "@/components/dashboard/PageHeader";
import DataTable, { type DataTableActions } from "@/components/shared/table/DataTable";
import { useAdminOrders, useMarkOrderDelivered } from "@/hooks/useDashboard";
import { formatOrderId } from "@/lib/format";
import type { AdminOrder } from "@/types/dashboard.types";

const NO_ORDERS: AdminOrder[] = [];
const getOrderId = (order: AdminOrder) => order.id;
const ORDER_FILTERS = [{ columnId: "status", label: "Statuses", options: ORDER_STATUS_OPTIONS }];
const NEWEST_FIRST = [{ id: "createdAt", desc: true }];

// The order stays set while a dialog closes, so its text does not change mid-animation.
type DialogState = { open: boolean; order?: AdminOrder };
const CLOSED: DialogState = { open: false };
const close = (state: DialogState): DialogState => ({ ...state, open: false });

const OrdersManager = () => {
  const { data: orders = NO_ORDERS, isPending, error, refetch } = useAdminOrders();
  const markDelivered = useMarkOrderDelivered();

  const [viewing, setViewing] = useState<DialogState>(CLOSED);
  const [toDeliver, setToDeliver] = useState<DialogState>(CLOSED);

  const pendingCount = orders.filter((order) => order.status === "pending").length;

  const actions = useMemo<DataTableActions<AdminOrder>>(
    () => ({
      onView: (order) => setViewing({ open: true, order }),
      custom: [
        {
          label: "Mark as delivered",
          icon: PackageCheck,
          isVisible: (order) => order.status !== "delivered",
          onSelect: (order) => setToDeliver({ open: true, order }),
        },
      ],
    }),
    [],
  );

  return (
    <>
      <PageHeader
        title="All Orders"
        description={isPending ? "Loading orders..." : `${orders.length} orders · ${pendingCount} waiting for delivery`}
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
        open={toDeliver.open}
        onOpenChange={(open) => !open && setToDeliver(close)}
        title="Mark this order as delivered?"
        description={
          <>
            Order <strong className="text-foreground">{toDeliver.order && formatOrderId(toDeliver.order.id)}</strong>{" "}
            for {toDeliver.order?.customerName} will move to Delivered.
          </>
        }
        confirmLabel="Mark delivered"
        isPending={markDelivered.isPending}
        onConfirm={() => {
          if (toDeliver.order) markDelivered.mutate(toDeliver.order.id, { onSuccess: () => setToDeliver(close) });
        }}
      />
    </>
  );
};

export default OrdersManager;
