import Image from "next/image";

import OrderStatusBadge from "@/components/shared/OrderStatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/assets";
import { formatDate, formatOrderId, formatPaymentMethod } from "@/lib/format";
import type { Order } from "@/types/order.types";

const OrdersTable = ({ orders }: { orders: Order[] }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Order</TableHead>
        <TableHead>Date</TableHead>
        <TableHead>Products</TableHead>
        <TableHead>Payment</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="text-right">Total</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {orders.map((order) => (
        <TableRow key={order.id}>
          <TableCell>
            <span className="font-medium">{formatOrderId(order.id)}</span>
          </TableCell>
          <TableCell>{formatDate(order.createdAt)}</TableCell>
          <TableCell>
            <ul className="flex flex-col gap-2">
              {order.items.map((item, index) => (
                <li key={`${item.productId}-${item.variation ?? index}`} className="flex items-center gap-3">
                  {item.image && (
                    <div className="relative size-10 shrink-0 overflow-hidden rounded-md border">
                      {/* Product images come from any host the admin used, so skip optimization. */}
                      <Image src={item.image} alt="" fill sizes="40px" unoptimized className="object-cover" />
                    </div>
                  )}
                  <span className="flex min-w-0 flex-col">
                    <span className="max-w-56 truncate">{item.name}</span>
                    {item.quantity !== undefined && (
                      <span className="text-xs text-muted-foreground">
                        {item.quantity} x {item.price === undefined ? "" : formatPrice(item.price)}
                        {item.variation && ` · ${item.variation}`}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </TableCell>
          <TableCell>{formatPaymentMethod(order.paymentMethod)}</TableCell>
          <TableCell>
            <OrderStatusBadge status={order.status} />
          </TableCell>
          <TableCell className="text-right">
            <span className="font-semibold">{formatPrice(order.totalAmount)}</span>
            {order.deliveryFee !== undefined && (
              <span className="block text-xs text-muted-foreground">incl. {formatPrice(order.deliveryFee)} delivery</span>
            )}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default OrdersTable;
