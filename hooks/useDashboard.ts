"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { toast } from "sonner";

import {
  createProductAction,
  deleteCategoryAction,
  deleteProductAction,
  importDemoCategoriesAction,
  removeFlashSaleAction,
  saveCategoryAction,
  setFlashSaleAction,
  updateOrderStatusAction,
  updateProductAction,
} from "@/actions/dashboard.actions";
import { adminCategoriesQuery, categoriesQuery } from "@/queries/category.queries";
import {
  flashSaleHistoryQuery,
  flashSaleQuery,
  productFlashSaleSummaryQuery,
} from "@/queries/flashSale.queries";
import { adminOrdersQuery } from "@/queries/order.queries";
import { adminProductQuery, adminProductsQuery } from "@/queries/product.queries";
import { dashboardKeys } from "@/queries/queryKeys";
import { dashboardStatsQuery } from "@/queries/stats.queries";
import { unwrapResult } from "@/queries/unwrapResult";
import type { FlashSaleHistoryQuery, OrderStatus, ProductListQuery } from "@/types/dashboard.types";
import type { ICategoryFormValues } from "@/zod/category.validation";
import type { IFlashSalePayload } from "@/zod/flashSale.validation";
import type { IProductFormValues } from "@/zod/product.validation";

export const useAdminProducts = (query: ProductListQuery) => useQuery(adminProductsQuery(query));

export const useAdminProduct = (id: string) => useQuery(adminProductQuery(id));

export const useFlashSaleProducts = (query: ProductListQuery) => useQuery(flashSaleQuery(query));

export const useFlashSaleHistory = (query: FlashSaleHistoryQuery) => useQuery(flashSaleHistoryQuery(query));

export const useProductFlashSaleSummary = (id: string) => useQuery(productFlashSaleSummaryQuery(id));

export const useAdminOrders = () => useQuery(adminOrdersQuery);

export const useDashboardStats = () => useQuery(dashboardStatsQuery);

export function useCategories() {
  const query = useQuery(categoriesQuery);
  // Products store the category slug; tables show its name.
  const nameBySlug = useMemo(
    () => new Map((query.data ?? []).map((category) => [category.slug, category.name])),
    [query.data],
  );
  return {
    data: query.data,
    isPending: query.isPending,
    getCategoryName: (slug: string) => nameBySlug.get(slug) ?? slug,
  };
}

/**
 * Shared success handling: refresh every product list, page and detail (they
 * all live under one key prefix) and the overview stats, then confirm.
 */
function useRefreshWithToast(queryKey: readonly unknown[]) {
  const queryClient = useQueryClient();
  return (message: string) => {
    toast.success(message);
    return Promise.all([
      queryClient.invalidateQueries({ queryKey }),
      queryClient.invalidateQueries({ queryKey: dashboardKeys.stats }),
    ]);
  };
}

export const useAdminCategories = () => useQuery(adminCategoriesQuery);

export function useSaveCategory() {
  const onSaved = useRefreshWithToast(dashboardKeys.categories);

  return useMutation({
    mutationFn: async ({ id, values }: { id?: string; values: ICategoryFormValues }) => {
      const result = await saveCategoryAction(id, values);
      if (!result.success) throw new Error(result.message);
      return result.message;
    },
    onSuccess: onSaved,
  });
}

export function useDeleteCategory() {
  const onDeleted = useRefreshWithToast(dashboardKeys.categories);

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteCategoryAction(id);
      if (!result.success) throw new Error(result.message);
      return result.message;
    },
    onSuccess: onDeleted,
    onError: (error) => toast.error(error.message),
  });
}

export function useImportDemoCategories() {
  const onImported = useRefreshWithToast(dashboardKeys.categories);

  return useMutation({
    mutationFn: async () => {
      const result = await importDemoCategoriesAction();
      if (!result.success) throw new Error(result.message);
      return result.message;
    },
    onSuccess: onImported,
    onError: (error) => toast.error(error.message),
  });
}

export function useSaveProduct() {
  const onSaved = useRefreshWithToast(dashboardKeys.products);

  return useMutation({
    mutationFn: async ({ id, values }: { id?: string; values: IProductFormValues }) => {
      const result = await (id ? updateProductAction(id, values) : createProductAction(values));
      if (!result.success) throw new Error(result.message);
      return result.message;
    },
    onSuccess: onSaved,
  });
}

export function useDeleteProduct() {
  const onDeleted = useRefreshWithToast(dashboardKeys.products);

  return useMutation({
    mutationFn: async (id: string) => {
      await unwrapResult(deleteProductAction(id));
      return "Product deleted";
    },
    onSuccess: onDeleted,
    onError: (error) => toast.error(error.message),
  });
}

export function useSetFlashSale() {
  const onSet = useRefreshWithToast(dashboardKeys.products);

  return useMutation({
    mutationFn: async (payload: IFlashSalePayload) => {
      const result = await setFlashSaleAction(payload);
      if (!result.success) throw new Error(result.message);
      return result.message;
    },
    onSuccess: onSet,
  });
}

export function useRemoveFlashSale() {
  const onRemoved = useRefreshWithToast(dashboardKeys.products);

  return useMutation({
    mutationFn: async (id: string) => {
      await unwrapResult(removeFlashSaleAction(id));
      return "Removed from the flash sale";
    },
    onSuccess: onRemoved,
    onError: (error) => toast.error(error.message),
  });
}

export function useUpdateOrderStatus() {
  // A cancel puts the stock back, so products refresh along with orders.
  const onUpdated = useRefreshWithToast(dashboardKeys.all);

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const result = await updateOrderStatusAction(id, status);
      if (!result.success) throw new Error(result.message);
      return result.message;
    },
    onSuccess: onUpdated,
    onError: (error) => toast.error(error.message),
  });
}
