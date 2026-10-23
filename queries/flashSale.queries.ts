import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import {
  getFlashSaleHistoryAction,
  getFlashSaleProductsAction,
  getProductFlashSaleSummaryAction,
} from "@/actions/dashboard.actions";
import { dashboardKeys } from "@/queries/queryKeys";
import { unwrapResult } from "@/queries/unwrapResult";
import type { FlashSaleHistoryQuery, ProductListQuery } from "@/types/dashboard.types";

/** First page of the flash sale table: the sales that end soonest come first. */
export const DEFAULT_FLASH_SALE_QUERY: ProductListQuery = { page: 1, limit: 10, sort: "flashSale.endAt" };

export const flashSaleQuery = (query: ProductListQuery) =>
  queryOptions({
    queryKey: dashboardKeys.flashSale(query),
    queryFn: () => unwrapResult(getFlashSaleProductsAction(query)),
    placeholderData: keepPreviousData,
  });

/** First page of the history: the newest sales first. */
export const DEFAULT_FLASH_SALE_HISTORY_QUERY: FlashSaleHistoryQuery = { page: 1, limit: 10 };

export const flashSaleHistoryQuery = (query: FlashSaleHistoryQuery) =>
  queryOptions({
    queryKey: dashboardKeys.flashSaleHistory(query),
    queryFn: () => unwrapResult(getFlashSaleHistoryAction(query)),
    placeholderData: keepPreviousData,
  });

export const productFlashSaleSummaryQuery = (id: string) =>
  queryOptions({
    queryKey: dashboardKeys.flashSaleSummary(id),
    queryFn: () => unwrapResult(getProductFlashSaleSummaryAction(id)),
  });
