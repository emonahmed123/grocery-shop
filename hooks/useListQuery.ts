"use client";

import type { PaginationState, SortingState } from "@tanstack/react-table";
import { useState } from "react";

import type { ProductListQuery } from "@/types/dashboard.types";

/** "-createdAt" <-> [{ id: "createdAt", desc: true }] */
const toSorting = (sort?: string): SortingState =>
  sort ? [{ id: sort.replace(/^-/, ""), desc: sort.startsWith("-") }] : [];
const toSort = (sorting: SortingState) =>
  sorting[0] ? `${sorting[0].desc ? "-" : ""}${sorting[0].id}` : undefined;

type FilterKey = "category";

/**
 * Keeps a backend list query (page, size, sort, search, category) and turns
 * it into the `server` options DataTable expects. Any change other than the
 * page itself goes back to page 1.
 */
export function useListQuery(initial: ProductListQuery) {
  const [query, setQuery] = useState(initial);

  const pagination: PaginationState = { pageIndex: query.page - 1, pageSize: query.limit };

  const tableState = {
    pagination,
    onPaginationChange: (next: PaginationState) =>
      setQuery((current) => ({ ...current, page: next.pageIndex + 1, limit: next.pageSize })),
    sorting: toSorting(query.sort),
    // Clearing the sort falls back to the default order rather than none.
    onSortingChange: (next: SortingState) =>
      setQuery((current) => ({ ...current, page: 1, sort: toSort(next) ?? initial.sort })),
    searchValue: query.searchTerm ?? "",
    onSearchChange: (value: string) =>
      setQuery((current) =>
        (current.searchTerm ?? "") === value ? current : { ...current, page: 1, searchTerm: value || undefined },
      ),
    filterValues: { category: query.category } as Record<string, string | undefined>,
    onFilterChange: (columnId: string, value: string | undefined) =>
      setQuery((current) => ({ ...current, page: 1, [columnId as FilterKey]: value })),
  };

  return { query, tableState };
}
