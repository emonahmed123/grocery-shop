"use client";

import { PaymentInfo } from "@/components/dashboard/orders/orderColumns";
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

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="flex flex-col gap-2">
    <h3 className="text-sm font-semibold text-foreground">{title}</h3>
    {children}
  </section>
);

const OrderDetailsDialog = ({ open, onOpenChange, order }: OrderDetailsDialogProps) => {
  const details = order
    ? [
        { label: "Customer", value: order.customerName },
        ...(order.customerEmail ? [{ label: "Email", value: order.customerEmail }] : []),
        { label: "Placed on", value: formatDate(order.createdAt) },
        { label: "Status", value: <OrderStatusBadge status={order.status} /> },
        { label: "Payment", value: <PaymentInfo order={order} /> },
      ]
    : [];

  const address = order?.shippingAddress;
  const instructions = order?.deliveryInstructions;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-svh overflow-y-auto sm:max-w-xl">
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

        {order && order.items.length > 0 && (
          <Section title="Items">
            <ul className="divide-y rounded-lg border text-sm">
              {order.items.map((item, index) => (
                <li key={`${item.productId}-${item.variation ?? index}`} className="flex justify-between gap-4 px-4 py-2.5">
                  <span className="text-foreground">
                    {item.name}
                    {item.variation && <span className="text-muted-foreground"> · {item.variation}</span>}
                    <span className="text-muted-foreground"> × {item.quantity}</span>
                  </span>
                  {item.price !== undefined && item.quantity !== undefined && (
                    <span className="shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  )}
                </li>
              ))}
              {order.deliveryFee !== undefined && (
                <li className="flex justify-between gap-4 px-4 py-2.5 text-muted-foreground">
                  <span>Delivery</span>
                  <span>{formatPrice(order.deliveryFee)}</span>
                </li>
              )}
              <li className="flex justify-between gap-4 px-4 py-2.5 font-semibold text-foreground">
                <span>Total</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </li>
            </ul>
          </Section>
        )}

        {address && (
          <Section title="Delivery">
            <p className="text-sm leading-6 text-muted-foreground">
              {address.address}, {address.district}
              <br />
              Phone: <a href={`tel:${address.phone}`} className="text-foreground underline">{address.phone}</a>
              {instructions?.leaveAtDoor && (
                <>
                  <br />
                  Leave at the door if nobody is home.
                </>
              )}
              {instructions?.note && (
                <>
                  <br />
                  Note: {instructions.note}
                </>
              )}
            </p>
          </Section>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
