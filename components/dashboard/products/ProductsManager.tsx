"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import ConfirmDialog from "@/components/dashboard/ConfirmDialog";
import PageHeader from "@/components/dashboard/PageHeader";
import { productColumns } from "@/components/dashboard/products/productColumns";
import ProductFormDialog from "@/components/dashboard/products/ProductFormDialog";
import DataTable, { type DataTableActions } from "@/components/shared/table/DataTable";
import { Button } from "@/components/ui/button";
import { useAdminProducts, useCategories, useDeleteProduct } from "@/hooks/useDashboard";
import { useListQuery } from "@/hooks/useListQuery";
import { DEFAULT_PRODUCT_QUERY } from "@/queries/product.queries";
import type { AdminProduct } from "@/types/dashboard.types";

const NO_PRODUCTS: AdminProduct[] = [];
const getProductId = (product: AdminProduct) => product.id;

// The product stays set while a dialog closes, so its text does not change mid-animation.
type DialogState = { open: boolean; product?: AdminProduct };
const CLOSED: DialogState = { open: false };
const close = (state: DialogState): DialogState => ({ ...state, open: false });

const ProductsManager = () => {
  const { query, tableState } = useListQuery(DEFAULT_PRODUCT_QUERY);
  const { data: page, isPending, isFetching, isPlaceholderData, error, refetch } = useAdminProducts(query);
  const { data: categories = [] } = useCategories();
  const deleteProduct = useDeleteProduct();

  const [form, setForm] = useState<DialogState>(CLOSED);
  const [toDelete, setToDelete] = useState<DialogState>(CLOSED);

  const filters = useMemo(
    () => [
      {
        columnId: "category",
        label: "Categories",
        options: categories.map((category) => ({ label: category.name, value: category.slug })),
      },
    ],
    [categories],
  );

  const actions = useMemo<DataTableActions<AdminProduct>>(
    () => ({
      getViewHref: (product) => `/dashboard/products/${product.id}`,
      onEdit: (product) => setForm({ open: true, product }),
      onDelete: (product) => setToDelete({ open: true, product }),
    }),
    [],
  );

  const total = page?.meta.total ?? 0;

  return (
    <>
      <PageHeader
        title="All Products"
        description={isPending ? "Loading products..." : `${total} product${total === 1 ? "" : "s"} in your store`}
      />

      <DataTable
        data={page?.data ?? NO_PRODUCTS}
        columns={productColumns}
        getRowId={getProductId}
        actions={actions}
        toolbarAction={
          <Button variant="brand" size="lg" className="h-12" onClick={() => setForm({ open: true })}>
            <Plus data-icon="inline-start" />
            Add Product
          </Button>
        }
        search={{ placeholder: "Search name, tag or category..." }}
        filters={filters}
        server={{
          ...tableState,
          rowCount: total,
          // Only a background page change counts; a plain refresh keeps the table calm.
          isFetching: isFetching && isPlaceholderData,
        }}
        isLoading={isPending}
        error={error?.message}
        onRetry={() => refetch()}
        emptyMessage={query.searchTerm || query.category ? "No products match your filters." : "No products yet."}
      />

      <ProductFormDialog
        open={form.open}
        onOpenChange={(open) => !open && setForm(close)}
        product={form.product}
      />

      <ConfirmDialog
        open={toDelete.open}
        onOpenChange={(open) => !open && setToDelete(close)}
        title="Delete this product?"
        description={
          <>
            <strong className="text-foreground">{toDelete.product?.name}</strong> will be removed from the store.
          </>
        }
        confirmLabel="Delete"
        destructive
        isPending={deleteProduct.isPending}
        onConfirm={() => {
          if (toDelete.product) deleteProduct.mutate(toDelete.product.id, { onSuccess: () => setToDelete(close) });
        }}
      />
    </>
  );
};

export default ProductsManager;
