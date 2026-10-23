import { ShoppingBag } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import OrdersTable from "@/components/account/OrdersTable";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/axios/httpClient";
import { getMyOrders } from "@/services/account.services";
import type { Order } from "@/types/order.types";

export const metadata: Metadata = {
  title: "My Orders | BoroBazar",
};

// Fetched on the server with the user's cookie, so the page arrives with data.
export default async function OrdersPage() {
  let orders: Order[] = [];
  let error: string | null = null;
  try {
    orders = await getMyOrders();
  } catch (cause) {
    error = getApiErrorMessage(cause, "Could not load your orders");
  }

  return (
    <>
      <h1 className="mb-6 text-xl font-bold text-foreground md:text-2xl">My Orders</h1>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <ShoppingBag className="size-12 text-muted-foreground" aria-hidden="true" />
          <p className="text-lg font-semibold text-foreground">No orders yet</p>
          <p className="text-sm text-muted-foreground">When you place an order, it will show up here.</p>
          <Button asChild variant="brand" size="lg" className="mt-2">
            <Link href="/search">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <OrdersTable orders={orders} />
      )}
    </>
  );
}
