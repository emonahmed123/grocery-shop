import type { Metadata } from "next";

import PrefetchBoundary from "@/components/dashboard/PrefetchBoundary";
import ProductsManager from "@/components/dashboard/products/ProductsManager";
import { categoriesQuery } from "@/queries/category.queries";
import { adminProductsQuery, DEFAULT_PRODUCT_QUERY } from "@/queries/product.queries";

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
