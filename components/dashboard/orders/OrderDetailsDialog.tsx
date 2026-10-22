"use client";

import OrderStatusBadge from "@/components/shared/OrderStatusBadge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatPrice } from "@/lib/assets";
import { formatDate, formatOrderId } from "@/lib/format";
import type { AdminOrder } from "@/types/dashboard.types";

interface OrderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order?: AdminOrder;
}

const OrderDetailsDialog = ({ open, onOpenChange, order }: OrderDetailsDialogProps) => {
  const details = order
    ? [
        { label: "Customer", value: order.customerName },
        { label: "Placed on", value: formatDate(order.createdAt) },
        { label: "Products", value: order.productCount },
        { label: "Items", value: order.quantity },
        { label: "Status", value: <OrderStatusBadge status={order.status} /> },
        { label: "Total", value: <span className="font-semibold">{formatPrice(order.totalAmount)}</span> },
      ]
    : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Order {order && formatOrderId(order.id)}</DialogTitle>
          <DialogDescription>Full order id: {order?.id}</DialogDescription>
        </DialogHeader>
        <dl className="divide-y rounded-lg border">
          {details.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="text-right text-foreground">{value}</dd>
            </div>
          ))}
        </dl>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
