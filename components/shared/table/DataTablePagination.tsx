"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type PageToken = number | "start-ellipsis" | "end-ellipsis";

export const PAGE_SIZES = [5, 10, 20, 50] as const;

/** Page numbers to show, with gaps collapsed: 1 … 4 5 6 … 12. */
export function getPageTokens(currentPage: number, totalPages: number): PageToken[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);
  if (currentPage <= 4) return [1, 2, 3, 4, 5, "end-ellipsis", totalPages];
  if (currentPage >= totalPages - 3) {
    return [1, "start-ellipsis", ...Array.from({ length: 5 }, (_, index) => totalPages - 4 + index)];
  }
  return [1, "start-ellipsis", currentPage - 1, currentPage, currentPage + 1, "end-ellipsis", totalPages];
}

interface DataTablePaginationProps {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  totalRows: number;
  /** Blocks paging while a requested page is still loading. */
  disabled?: boolean;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

// Takes plain values rather than the table instance, so it always re-renders
// with the latest page state.
const DataTablePagination = ({
  pageIndex,
  pageSize,
  pageCount,
  totalRows,
  disabled = false,
  onPageChange,
  onPageSizeChange,
}: DataTablePaginationProps) => {
  const currentPage = pageIndex + 1;
  const firstRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const lastRow = Math.min(totalRows, (pageIndex + 1) * pageSize);

  return (
    <div className="flex flex-col gap-3 border-t px-4 py-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Rows per page</span>
        <Select value={String(pageSize)} onValueChange={(value) => onPageSizeChange(Number(value))} disabled={disabled}>
          <SelectTrigger size="sm" aria-label="Rows per page" className="w-18">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper">
            {PAGE_SIZES.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span>
          {firstRow}-{lastRow} of {totalRows}
        </span>
      </div>

      {pageCount > 1 && (
        <nav aria-label="Pagination" className="flex flex-wrap items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pageIndex - 1)}
            disabled={disabled || currentPage === 1}
          >
            <ChevronLeft data-icon="inline-start" />
            Prev
          </Button>

          {getPageTokens(currentPage, pageCount).map((token) =>
            typeof token === "number" ? (
              <Button
                key={token}
                variant={token === currentPage ? "brand" : "ghost"}
                size="icon-sm"
                aria-current={token === currentPage ? "page" : undefined}
                onClick={() => onPageChange(token - 1)}
                disabled={disabled && token !== currentPage}
              >
                {token}
              </Button>
            ) : (
              <span key={token} className="px-1 text-sm text-muted-foreground" aria-hidden="true">
                …
              </span>
            ),
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pageIndex + 1)}
            disabled={disabled || currentPage === pageCount}
          >
            Next
            <ChevronRight data-icon="inline-end" />
          </Button>
        </nav>
      )}
    </div>
  );
};

export default DataTablePagination;
