import type { Metadata } from "next";

import DashboardOverview from "@/components/dashboard/overview/DashboardOverview";
import PrefetchBoundary from "@/components/dashboard/PrefetchBoundary";
import { categoriesQuery } from "@/queries/category.queries";
import { dashboardStatsQuery } from "@/queries/stats.queries";

export const metadata: Metadata = {
  title: "Dashboard | BoroBazar",
};

export default function DashboardPage() {
  return (
    <PrefetchBoundary queries={[dashboardStatsQuery, categoriesQuery]}>
      <DashboardOverview />
    </PrefetchBoundary>
  );
}
