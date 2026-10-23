"use client";

import {
  functionalUpdate,
  type PaginationState,
  type RowData,
  type SortingState,
  type Updater,
  useTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, Eye, type LucideIcon, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo } from "react";

import DataTableFilters, { type DataTableFilterConfig } from "@/components/shared/table/DataTableFilters";
import DataTablePagination, { PAGE_SIZES } from "@/components/shared/table/DataTablePagination";
import DataTableSearch from "@/components/shared/table/DataTableSearch";
import {
  createDataTableColumns,
  type DataTableColumnDef,
  dataTableFeatures,
} from "@/components/shared/table/tableFeatures";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface DataTableRowAction<TData> {
  label: string;
  icon?: LucideIcon;
  onSelect: (row: TData) => void;
  /** Hide the item for rows it does not apply to. */
  isVisible?: (row: TData) => boolean;
}

export interface DataTableActions<TData> {
  /** Shown as a visible eye button that links to the row's details page. */
  getViewHref?: (row: TData) => string;
  onView?: (row: TData) => void;
  onEdit?: (row: TData) => void;
  onDelete?: (row: TData) => void;
  /** Extra items shown between Edit and Delete. */
  custom?: DataTableRowAction<TData>[];
}

/**
 * Hand paging, sorting, search and filters to the backend. The table then
 * shows `data` as the current page and reports every change upward.
 */
export interface DataTableServerOptions {
  rowCount: number;
  pagination: PaginationState;
  onPaginationChange: (pagination: PaginationState) => void;
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filterValues?: Record<string, string | undefined>;
  onFilterChange?: (columnId: string, value: string | undefined) => void;
  /** A newer page is loading while `data` still shows the previous one. */
  isFetching?: boolean;
}

export interface DataTableProps<TData extends RowData> {
  /** Keep this array stable (state, query data or a module constant). */
  data: TData[];
  columns: DataTableColumnDef<TData>[];
  getRowId?: (row: TData) => string;
  actions?: DataTableActions<TData>;
  /** Shown at the end of the toolbar, e.g. an "Add" button. */
  toolbarAction?: React.ReactNode;
  search?: { placeholder?: string };
  filters?: DataTableFilterConfig[];
  /** Client mode only; in server mode pass `server.sorting`. */
  initialSorting?: SortingState;
  pageSize?: (typeof PAGE_SIZES)[number];
  server?: DataTableServerOptions;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyMessage?: string;
}

const SortIcon = ({ direction }: { direction: false | "asc" | "desc" }) => {
  if (direction === "asc") return <ArrowUp className="size-3.5" aria-hidden="true" />;
  if (direction === "desc") return <ArrowDown className="size-3.5" aria-hidden="true" />;
  return <ArrowUpDown className="size-3.5 opacity-40" aria-hidden="true" />;
};

const NO_FILTERS: Record<string, string | undefined> = {};

/**
 * Reusable table: search, column filters, sorting, pagination and row
 * actions. Works on loaded rows by default, or with the backend through
 * `server`. Columns come from `createDataTableColumns<TData>()`.
 */
const DataTable = <TData extends RowData>({
  data,
  columns,
  getRowId,
  actions,
  toolbarAction,
  search,
  filters,
  initialSorting = [],
  pageSize = 10,
  server,
  isLoading = false,
  error,
  onRetry,
  emptyMessage = "No data found.",
}: DataTableProps<TData>) => {
  const tableColumns = useMemo(() => {
    if (!actions) return columns;
    const helper = createDataTableColumns<TData>();

    return [
      ...columns,
      helper.display({
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => {
          const item = row.original;
          const custom = actions.custom?.filter((action) => action.isVisible?.(item) ?? true) ?? [];
          const hasMenu = Boolean(actions.onView || actions.onEdit || actions.onDelete || custom.length);

          return (
            <div className="flex items-center justify-end gap-1">
              {actions.getViewHref && (
                <Button asChild variant="ghost" size="icon-sm" aria-label="View details">
                  <Link href={actions.getViewHref(item)}>
                    <Eye />
                  </Link>
                </Button>
              )}
              {hasMenu && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm" aria-label="Open row actions">
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {actions.onView && (
                      <DropdownMenuItem onSelect={() => actions.onView?.(item)}>
                        <Eye />
                        View
                      </DropdownMenuItem>
                    )}
                    {actions.onEdit && (
                      <DropdownMenuItem onSelect={() => actions.onEdit?.(item)}>
                        <Pencil />
                        Edit
                      </DropdownMenuItem>
                    )}
                    {custom.map(({ label, icon: Icon, onSelect }) => (
                      <DropdownMenuItem key={label} onSelect={() => onSelect(item)}>
                        {Icon && <Icon />}
                        {label}
                      </DropdownMenuItem>
                    ))}
                    {actions.onDelete && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onSelect={() => actions.onDelete?.(item)}>
                          <Trash2 />
                          Delete
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          );
        },
      }),
    ];
  }, [columns, actions]);

  const table = useTable({
    features: dataTableFeatures,
    columns: tableColumns,
    data,
    getRowId,
    globalFilterFn: "includesString",
    getColumnCanGlobalFilter: (column) => column.id !== "actions",
    ...(server
      ? {
          // The backend already paged, sorted and filtered these rows.
          manualPagination: true,
          manualSorting: true,
          manualFiltering: true,
          rowCount: server.rowCount,
          state: { pagination: server.pagination, sorting: server.sorting },
          onPaginationChange: (updater: Updater<PaginationState>) =>
            server.onPaginationChange(functionalUpdate(updater, server.pagination)),
          onSortingChange: (updater: Updater<SortingState>) =>
            server.onSortingChange(functionalUpdate(updater, server.sorting)),
        }
      : {
          initialState: {
            sorting: initialSorting,
            pagination: { pageIndex: 0, pageSize },
          },
        }),
  });

  // Stable callbacks, so the search box's debounce effect does not restart every render.
  const onServerSearch = server?.onSearchChange;
  const setSearch = useCallback(
    (value: string) => (onServerSearch ? onServerSearch(value) : table.setGlobalFilter(value)),
    [onServerSearch, table],
  );

  const { pagination, columnFilters } = table.state;
  const clientFilterValues = Object.fromEntries(
    columnFilters.map((filter) => [filter.id, typeof filter.value === "string" ? filter.value : undefined]),
  );
  const filterValues = server ? (server.filterValues ?? NO_FILTERS) : clientFilterValues;
  const onFilterChange = (columnId: string, value: string | undefined) =>
    server?.onFilterChange
      ? server.onFilterChange(columnId, value)
      : table.getColumn(columnId)?.setFilterValue(value);
  const clearFilters = () =>
    server?.onFilterChange
      ? filters?.forEach((filter) => server.onFilterChange?.(filter.columnId, undefined))
      : table.resetColumnFilters();

  const rows = table.getRowModel().rows;
  const columnCount = tableColumns.length;
  const showSkeleton = isLoading && data.length === 0;
  const isRefreshing = Boolean(server?.isFetching) && !showSkeleton;
  const totalRows = server ? server.rowCount : table.getFilteredRowModel().rows.length;

  let bodyMessage: React.ReactNode = null;
  if (error && data.length === 0) {
    bodyMessage = (
      <div className="flex flex-col items-center gap-3">
        <span className="text-destructive">{error}</span>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Try again
          </Button>
        )}
      </div>
    );
  } else if (!showSkeleton && rows.length === 0) {
    bodyMessage = emptyMessage;
  }

  return (
    <div className="flex flex-col gap-4">
      {(search || filters || toolbarAction) && (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {search && (
            <DataTableSearch
              initialValue={server?.searchValue}
              placeholder={search.placeholder}
              onDebouncedChange={setSearch}
            />
          )}
          {filters && (
            <DataTableFilters
              filters={filters}
              values={filterValues}
              onFilterChange={onFilterChange}
              onClearAll={clearFilters}
            />
          )}
          {toolbarAction && <div className="lg:ml-auto">{toolbarAction}</div>}
        </div>
      )}

      <div className="relative overflow-hidden rounded-lg border bg-background" aria-busy={isLoading || isRefreshing}>
        {/* A thin bar while a newer page loads; the old rows stay readable underneath. */}
        {isRefreshing && (
          <div className="absolute inset-x-0 top-0 z-10 h-0.5 overflow-hidden" role="progressbar" aria-label="Loading">
            <div className="h-full w-full animate-pulse bg-brand" />
          </div>
        )}
        {/* Rows fade while a newer page loads; they stay readable. */}
        <div className={isRefreshing ? "opacity-60 transition-opacity" : "transition-opacity"}>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((group) => (
                <TableRow key={group.id}>
                  {group.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      aria-sort={
                        header.column.getIsSorted()
                          ? header.column.getIsSorted() === "asc"
                            ? "ascending"
                            : "descending"
                          : undefined
                      }
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="inline-flex items-center gap-1.5 font-semibold hover:text-foreground"
                        >
                          <table.FlexRender header={header} />
                          <SortIcon direction={header.column.getIsSorted()} />
                        </button>
                      ) : (
                        <table.FlexRender header={header} />
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {showSkeleton &&
                Array.from({ length: Math.min(pageSize, 5) }, (_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    {Array.from({ length: columnCount }, (_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

              {rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

              {bodyMessage && (
                <TableRow>
                  <TableCell colSpan={columnCount}>
                    <div className="py-10 text-center text-muted-foreground">{bodyMessage}</div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {!showSkeleton && (
          <DataTablePagination
            pageIndex={pagination.pageIndex}
            pageSize={pagination.pageSize}
            pageCount={table.getPageCount()}
            totalRows={totalRows}
            disabled={isRefreshing}
            onPageChange={table.setPageIndex}
            onPageSizeChange={(size) => table.setPagination({ pageIndex: 0, pageSize: size })}
          />
        )}
      </div>
    </div>
  );
};

export default DataTable;
