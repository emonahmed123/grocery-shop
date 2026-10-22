"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { toast } from "sonner";

import {
  createProductAction,
  deleteProductAction,
  markOrderDeliveredAction,
  removeFlashSaleAction,
  setFlashSaleAction,
  updateProductAction,
} from "@/actions/dashboard.actions";
import {
  adminOrdersQuery,
  adminProductQuery,
  adminProductsQuery,
  categoriesQuery,
  dashboardKeys,
  flashSaleQuery,
  unwrapResult,
} from "@/lib/dashboardQueries";
import type { ProductListQuery } from "@/types/dashboard.types";
import type { IFlashSalePayload } from "@/zod/flashSale.validation";
import type { IProductFormValues } from "@/zod/product.validation";

export const useAdminProducts = (query: ProductListQuery) => useQuery(adminProductsQuery(query));

export const useAdminProduct = (id: string) => useQuery(adminProductQuery(id));

export const useFlashSaleProducts = (query: ProductListQuery) => useQuery(flashSaleQuery(query));

export const useAdminOrders = () => useQuery(adminOrdersQuery);

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
 * all live under one key prefix), then confirm.
 */
function useRefreshWithToast(queryKey: readonly unknown[]) {
  const queryClient = useQueryClient();
  return (message: string) => {
    toast.success(message);
    return queryClient.invalidateQueries({ queryKey });
  };
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

export function useMarkOrderDelivered() {
  const onDelivered = useRefreshWithToast(dashboardKeys.orders);

  return useMutation({
    mutationFn: async (id: string) => {
      await unwrapResult(markOrderDeliveredAction(id));
      return "Order marked as delivered";
    },
    onSuccess: onDelivered,
    onError: (error) => toast.error(error.message),
  });
}
