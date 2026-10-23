"use client";

import Link from "next/link";

import { SalePeriod, SaleRevenue } from "@/components/dashboard/flash-sale/flashSaleHistoryColumns";
import FlashSaleStateBadge from "@/components/dashboard/flash-sale/FlashSaleStateBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFlashSaleHistory, useProductFlashSaleSummary } from "@/hooks/useDashboard";
import { formatPrice } from "@/lib/assets";

const RECENT_SALES = 5;

const Total = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex flex-col gap-0.5 rounded-md bg-fill-thumbnail px-3 py-2">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="font-semibold text-foreground">{value}</span>
  </div>
);

/** Every flash sale this product had, and what it sold at flash prices in total. */
const ProductFlashSaleHistory = ({ productId }: { productId: string }) => {
  const summary = useProductFlashSaleSummary(productId);
  const history = useFlashSaleHistory({ page: 1, limit: RECENT_SALES, product: productId });
  const records = history.data?.data ?? [];
  const total = history.data?.meta.total ?? 0;

  return (
    <section className="flex flex-col rounded-lg border bg-background sm:col-span-2">
      <div className="flex min-h-12 items-center justify-between gap-3 border-b px-5 py-3">
        <h2 className="text-sm font-semibold text-foreground">Flash sale history</h2>
        {total > RECENT_SALES && (
          <Button asChild variant="link" size="sm">
            <Link href="/dashboard/flash-sale">See all</Link>
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-4 p-5">
        {summary.isPending ? (
          <Skeleton className="h-14 w-full" />
        ) : summary.data ? (
          // Counted from orders, so sales from before history was kept are in here too.
          <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
            <Total label="Flash sales" value={summary.data.saleCount} />
            <Total label="Units sold" value={summary.data.unitsSold} />
            <Total label="Orders" value={summary.data.orderCount} />
            <Total label="Revenue" value={formatPrice(summary.data.revenue)} />
          </div>
        ) : (
          <p className="text-sm text-destructive">{summary.error?.message}</p>
        )}

        {history.isPending ? (
          <Skeleton className="h-24 w-full" />
        ) : history.isError ? (
          <p className="text-sm text-destructive">{history.error.message}</p>
        ) : records.length === 0 ? (
          <p className="py-2 text-center text-sm text-muted-foreground">This product has not had a flash sale yet.</p>
        ) : (
          <ul className="flex flex-col divide-y rounded-md border">
            {records.map((record) => (
              <li key={record.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
                <div className="flex flex-col gap-1">
                  <span className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{record.discountPercentage}% off</span>
                    <FlashSaleStateBadge state={record.state} />
                  </span>
                  <SalePeriod record={record} />
                </div>
                <div className="flex items-center gap-6 text-right">
                  <span className="text-muted-foreground">
                    {record.soldCount}
                    {record.quantityLimit ? ` / ${record.quantityLimit}` : ""} sold
                  </span>
                  <SaleRevenue record={record} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default ProductFlashSaleHistory;
