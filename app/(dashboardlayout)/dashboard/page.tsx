import type { Metadata } from "next";

import DashboardOverview from "@/components/dashboard/overview/DashboardOverview";
import PrefetchBoundary from "@/components/dashboard/PrefetchBoundary";
import { adminOrdersQuery, adminProductsQuery, categoriesQuery, OVERVIEW_PRODUCT_QUERY } from "@/lib/dashboardQueries";

export const metadata: Metadata = {
  title: "Dashboard | BoroBazar",
};

export default function DashboardPage() {
  return (
    <PrefetchBoundary queries={[adminProductsQuery(OVERVIEW_PRODUCT_QUERY), adminOrdersQuery, categoriesQuery]}>
      <DashboardOverview />
    </PrefetchBoundary>
  );
}
