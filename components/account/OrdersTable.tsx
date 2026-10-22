import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/assets";
import type { Order } from "@/types/order.types";

const dateFormat = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

// Capitalise whatever status the backend sends, e.g. "pending" -> "Pending".
const formatStatus = (status: string) => status.charAt(0).toUpperCase() + status.slice(1);

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
          {/* The last characters of the id are enough to tell orders apart. */}
          <TableCell>
            <span className="font-medium">#{order.id.slice(-6).toUpperCase()}</span>
          </TableCell>
          <TableCell>{order.createdAt ? dateFormat.format(new Date(order.createdAt)) : "—"}</TableCell>
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
            <Badge variant={order.status === "delivered" ? "default" : "outline"}>
              {formatStatus(order.status)}
            </Badge>
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
