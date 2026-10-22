"use client";

import { Zap, ZapOff } from "lucide-react";
import { useMemo, useState } from "react";

import ConfirmDialog from "@/components/dashboard/ConfirmDialog";
import { flashSaleColumns } from "@/components/dashboard/flash-sale/flashSaleColumns";
import FlashSaleDialog from "@/components/dashboard/flash-sale/FlashSaleDialog";
import PageHeader from "@/components/dashboard/PageHeader";
import DataTable, { type DataTableActions } from "@/components/shared/table/DataTable";
import { Button } from "@/components/ui/button";
import { useFlashSaleProducts, useRemoveFlashSale } from "@/hooks/useDashboard";
import { useListQuery } from "@/hooks/useListQuery";
import { DEFAULT_FLASH_SALE_QUERY } from "@/lib/dashboardQueries";
import type { AdminProduct } from "@/types/dashboard.types";

const NO_PRODUCTS: AdminProduct[] = [];
const getProductId = (product: AdminProduct) => product.id;

type DialogState = { open: boolean; product?: AdminProduct };
const CLOSED: DialogState = { open: false };
const close = (state: DialogState): DialogState => ({ ...state, open: false });

const FlashSaleManager = () => {
  const { query, tableState } = useListQuery(DEFAULT_FLASH_SALE_QUERY);
  const { data: page, isPending, isFetching, isPlaceholderData, error, refetch } = useFlashSaleProducts(query);
  const removeFlashSale = useRemoveFlashSale();

  const [creating, setCreating] = useState(false);
  const [toRemove, setToRemove] = useState<DialogState>(CLOSED);

  const actions = useMemo<DataTableActions<AdminProduct>>(
    () => ({
      getViewHref: (product) => `/dashboard/products/${product.id}`,
      custom: [
        {
          label: "Remove from flash sale",
          icon: ZapOff,
          onSelect: (product) => setToRemove({ open: true, product }),
        },
      ],
    }),
    [],
  );

  const total = page?.meta.total ?? 0;

  return (
    <>
      <PageHeader
        title="Flash Sale"
        description={
          isPending ? "Loading flash sale..." : `${total} product${total === 1 ? "" : "s"} on sale right now`
        }
      />

      <DataTable
        data={page?.data ?? NO_PRODUCTS}
        columns={flashSaleColumns}
        getRowId={getProductId}
        actions={actions}
        toolbarAction={
          <Button variant="brand" size="lg" className="h-12" onClick={() => setCreating(true)}>
            <Zap data-icon="inline-start" />
            Create Flash Sale
          </Button>
        }
        search={{ placeholder: "Search flash sale products..." }}
        server={{ ...tableState, rowCount: total, isFetching: isFetching && isPlaceholderData }}
        isLoading={isPending}
        error={error?.message}
        onRetry={() => refetch()}
        emptyMessage={
          query.searchTerm
            ? "No flash sale products match your search."
            : "No flash sale is running. Scheduled sales appear here once they start."
        }
      />

      <FlashSaleDialog open={creating} onOpenChange={setCreating} />

      <ConfirmDialog
        open={toRemove.open}
        onOpenChange={(open) => !open && setToRemove(close)}
        title="Remove from the flash sale?"
        description={
          <>
            <strong className="text-foreground">{toRemove.product?.name}</strong> goes back to its normal price
            straight away.
          </>
        }
        confirmLabel="Remove"
        destructive
        isPending={removeFlashSale.isPending}
        onConfirm={() => {
          if (toRemove.product) {
            removeFlashSale.mutate(toRemove.product.id, { onSuccess: () => setToRemove(close) });
          }
        }}
      />
    </>
  );
};

export default FlashSaleManager;
