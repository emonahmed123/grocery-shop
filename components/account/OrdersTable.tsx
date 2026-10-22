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
import { formatDate, formatOrderId } from "@/lib/format";
import type { Order } from "@/types/order.types";

const OrdersTable = ({ orders }: { orders: Order[] }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Order</TableHead>
        <TableHead>Date</TableHead>
        <TableHead>Products</TableHead>
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
              {order.products.map((product) => (
                <li key={product.id} className="flex items-center gap-3">
                  {product.image && (
                    <div className="relative size-10 shrink-0 overflow-hidden rounded-md border">
                      {/* Product images come from any host the admin used, so skip optimization. */}
                      <Image src={product.image} alt="" fill sizes="40px" unoptimized className="object-cover" />
                    </div>
                  )}
                  <span className="max-w-56 truncate">{product.name}</span>
                </li>
              ))}
            </ul>
          </TableCell>
          <TableCell>
            <OrderStatusBadge status={order.status} />
          </TableCell>
          <TableCell className="text-right">
            <span className="font-semibold">{formatPrice(order.totalAmount)}</span>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default OrdersTable;
