import type { Metadata } from "next";

import PrefetchBoundary from "@/components/dashboard/PrefetchBoundary";
import ProductsManager from "@/components/dashboard/products/ProductsManager";
import { adminProductsQuery, categoriesQuery, DEFAULT_PRODUCT_QUERY } from "@/lib/dashboardQueries";

export const metadata: Metadata = {
  title: "Products | BoroBazar Dashboard",
};

export default function ProductsPage() {
  return (
    <PrefetchBoundary queries={[adminProductsQuery(DEFAULT_PRODUCT_QUERY), categoriesQuery]}>
      <ProductsManager />
    </PrefetchBoundary>
  );
}
