import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductDetails from "@/components/dashboard/products/ProductDetails";
import { adminProductQuery, categoriesQuery } from "@/lib/dashboardQueries";

export const metadata: Metadata = {
  title: "Product Details | BoroBazar Dashboard",
};

type ProductDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  // `null` means the backend has no such product; a failed request is left
  // for the client to retry and report.
  const [product] = await Promise.all([
    queryClient.fetchQuery(adminProductQuery(id)).catch(() => undefined),
    queryClient.prefetchQuery(categoriesQuery),
  ]);
  if (product === null) notFound();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductDetails id={id} />
    </HydrationBoundary>
  );
}
