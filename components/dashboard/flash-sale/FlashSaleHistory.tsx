"use client";

import type { PaginationState } from "@tanstack/react-table";
import { useMemo, useState } from "react";

import { flashSaleHistoryColumns } from "@/components/dashboard/flash-sale/flashSaleHistoryColumns";
import { FLASH_SALE_STATE_OPTIONS } from "@/components/dashboard/flash-sale/FlashSaleStateBadge";
import DataTable, { type DataTableActions } from "@/components/shared/table/DataTable";
import { useFlashSaleHistory } from "@/hooks/useDashboard";
import { DEFAULT_FLASH_SALE_HISTORY_QUERY } from "@/queries/flashSale.queries";
import type { FlashSaleHistoryQuery, FlashSaleRecord, FlashSaleState } from "@/types/dashboard.types";

const NO_RECORDS: FlashSaleRecord[] = [];
const NO_SORTING: never[] = [];
const getRecordId = (record: FlashSaleRecord) => record.id;
const HISTORY_FILTERS = [{ columnId: "state", label: "Statuses", options: FLASH_SALE_STATE_OPTIONS }];

/** Every flash sale ever run, including removed and replaced ones, with what each sold. */
const FlashSaleHistory = () => {
  const [query, setQuery] = useState<FlashSaleHistoryQuery>(DEFAULT_FLASH_SALE_HISTORY_QUERY);
  const { data: page, isPending, isFetching, isPlaceholderData, error, refetch } = useFlashSaleHistory(query);

  const actions = useMemo<DataTableActions<FlashSaleRecord>>(
    () => ({ getViewHref: (record) => `/dashboard/products/${record.productId}` }),
    [],
  );

  return (
    <DataTable
      data={page?.data ?? NO_RECORDS}
      columns={flashSaleHistoryColumns}
      getRowId={getRecordId}
      actions={actions}
      filters={HISTORY_FILTERS}
      server={{
        rowCount: page?.meta.total ?? 0,
        pagination: { pageIndex: query.page - 1, pageSize: query.limit },
        onPaginationChange: (next: PaginationState) =>
          setQuery((current) => ({ ...current, page: next.pageIndex + 1, limit: next.pageSize })),
        // Always newest first.
        sorting: NO_SORTING,
        onSortingChange: () => {},
        filterValues: { state: query.state },
        onFilterChange: (_columnId, value) =>
          setQuery((current) => ({ ...current, page: 1, state: value as FlashSaleState | undefined })),
        isFetching: isFetching && isPlaceholderData,
      }}
      isLoading={isPending}
      error={error?.message}
      onRetry={() => refetch()}
      emptyMessage={query.state ? "No flash sales with this status." : "No flash sales yet."}
    />
  );
};

export default FlashSaleHistory;
