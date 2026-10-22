import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import {
  getAdminProductAction,
  getAdminProductsAction,
  getAllOrdersAction,
  getCategoriesAction,
  getFlashSaleProductsAction,
} from "@/actions/dashboard.actions";
import type { ApiResult } from "@/types/api.types";
import type { ProductListQuery } from "@/types/dashboard.types";

// Shared by server pages (prefetch) and client hooks, so it must not be a
// "use client" module: both sides need the real keys and query functions.
export const dashboardKeys = {
  all: ["dashboard"] as const,
  products: ["dashboard", "products"] as const,
  productList: (query: ProductListQuery) => ["dashboard", "products", "list", query] as const,
  product: (id: string) => ["dashboard", "products", "detail", id] as const,
  flashSale: (query: ProductListQuery) => ["dashboard", "products", "flash-sale", query] as const,
  categories: ["dashboard", "categories"] as const,
  orders: ["dashboard", "orders"] as const,
};

/** First page the products table asks for; the server prefetches the same one. */
export const DEFAULT_PRODUCT_QUERY: ProductListQuery = { page: 1, limit: 10, sort: "-createdAt" };

/** First page of the flash sale table: the sales that end soonest come first. */
export const DEFAULT_FLASH_SALE_QUERY: ProductListQuery = { page: 1, limit: 10, sort: "flashSale.endAt" };

/**
 * The overview needs every product for its counts. The backend caps nothing,
 * so one large page is enough for a store of this size.
 */
export const OVERVIEW_PRODUCT_QUERY: ProductListQuery = { page: 1, limit: 1000 };

/** Server actions return a result object; TanStack Query needs a throw on failure. */
export async function unwrapResult<TData>(request: Promise<ApiResult<TData>>) {
  const result = await request;
  if (!result.success) throw new Error(result.message);
  return result.data;
}

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

export const flashSaleQuery = (query: ProductListQuery) =>
  queryOptions({
    queryKey: dashboardKeys.flashSale(query),
    queryFn: () => unwrapResult(getFlashSaleProductsAction(query)),
    placeholderData: keepPreviousData,
  });

export const categoriesQuery = queryOptions({
  queryKey: dashboardKeys.categories,
  queryFn: () => unwrapResult(getCategoriesAction()),
  staleTime: 10 * 60 * 1000,
});

export const adminOrdersQuery = queryOptions({
  queryKey: dashboardKeys.orders,
  queryFn: () => unwrapResult(getAllOrdersAction()),
});
