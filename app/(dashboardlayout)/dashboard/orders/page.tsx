import type { Metadata } from "next";

import OrdersManager from "@/components/dashboard/orders/OrdersManager";
import PrefetchBoundary from "@/components/dashboard/PrefetchBoundary";
import { adminOrdersQuery } from "@/lib/dashboardQueries";

export const metadata: Metadata = {
  title: "All Orders | BoroBazar Dashboard",
};

export default function OrdersPage() {
  return (
    <PrefetchBoundary queries={[adminOrdersQuery]}>
      <OrdersManager />
    </PrefetchBoundary>
  );
}
