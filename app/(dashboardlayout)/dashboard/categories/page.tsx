import type { Metadata } from "next";

import CategoriesManager from "@/components/dashboard/categories/CategoriesManager";
import PrefetchBoundary from "@/components/dashboard/PrefetchBoundary";
import { adminCategoriesQuery } from "@/queries/category.queries";

export const metadata: Metadata = {
  title: "Categories | BoroBazar Dashboard",
};

export default function CategoriesPage() {
  return (
    <PrefetchBoundary queries={[adminCategoriesQuery]}>
      <CategoriesManager />
    </PrefetchBoundary>
  );
}
