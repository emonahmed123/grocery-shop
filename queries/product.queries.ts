import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import { getAdminProductAction, getAdminProductsAction } from "@/actions/dashboard.actions";
import { dashboardKeys } from "@/queries/queryKeys";
import { unwrapResult } from "@/queries/unwrapResult";
import type { ProductListQuery } from "@/types/dashboard.types";

// Query files are shared by server pages (prefetch) and client hooks, so they
// must not be "use client" modules: both sides need the real keys and fetchers.

/** First page the products table asks for; the server prefetches the same one. */
export const DEFAULT_PRODUCT_QUERY: ProductListQuery = { page: 1, limit: 10, sort: "-createdAt" };

export const adminProductsQuery = (query: ProductListQuery) =>
  queryOptions({
    queryKey: dashboardKeys.productList(query),
    queryFn: () => unwrapResult(getAdminProductsAction(query)),
    // Keep the current page on screen while the next one loads.
    placeholderData: keepPreviousData,
  });

export const adminProductQuery = (id: string) =>
  queryOptions({
    queryKey: dashboardKeys.product(id),
    queryFn: () => unwrapResult(getAdminProductAction(id)),
  });
