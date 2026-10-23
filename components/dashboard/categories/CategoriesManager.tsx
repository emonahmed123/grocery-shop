"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { categoryColumns } from "@/components/dashboard/categories/categoryColumns";
import CategoryFormDialog from "@/components/dashboard/categories/CategoryFormDialog";
import ConfirmDialog from "@/components/dashboard/ConfirmDialog";
import PageHeader from "@/components/dashboard/PageHeader";
import DataTable, { type DataTableActions } from "@/components/shared/table/DataTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAdminCategories, useDeleteCategory, useImportDemoCategories } from "@/hooks/useDashboard";
import type { AdminCategory } from "@/types/dashboard.types";

const NO_CATEGORIES: AdminCategory[] = [];
const getCategoryId = (category: AdminCategory) => category.id;
const BY_NAME = [{ id: "name", desc: false }];

// The category stays set while a dialog closes, so its text does not change mid-animation.
type DialogState = { open: boolean; category?: AdminCategory };
const CLOSED: DialogState = { open: false };
const close = (state: DialogState): DialogState => ({ ...state, open: false });

const CategoriesManager = () => {
  const { data: categories = NO_CATEGORIES, isPending, error, refetch } = useAdminCategories();
  const deleteCategory = useDeleteCategory();
  const importDemo = useImportDemoCategories();

  const [form, setForm] = useState<DialogState>(CLOSED);
  const [toDelete, setToDelete] = useState<DialogState>(CLOSED);

  const actions = useMemo<DataTableActions<AdminCategory>>(
    () => ({
      onEdit: (category) => setForm({ open: true, category }),
      onDelete: (category) => setToDelete({ open: true, category }),
    }),
    [],
  );

  const isEmpty = !isPending && !error && categories.length === 0;

  return (
    <>
      <PageHeader
        title="Categories"
        description={
          isPending
            ? "Loading categories..."
            : `${categories.length} categor${categories.length === 1 ? "y" : "ies"} in your store`
        }
      />

      {/* With no saved categories the store falls back to its demo list. */}
      {isEmpty && (
        <Alert className="mb-5">
          <AlertTitle>The store is showing its demo categories</AlertTitle>
          <AlertDescription>
            <p>
              Add your own, or copy the demo ones here to edit them. Once any category is saved, the store shows only
              saved categories.
            </p>
            <Button
              variant="outline"
              className="mt-3"
              disabled={importDemo.isPending}
              onClick={() => importDemo.mutate()}
            >
              {importDemo.isPending ? "Copying..." : "Copy demo categories"}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <DataTable
        data={categories}
        columns={categoryColumns}
        getRowId={getCategoryId}
        actions={actions}
        toolbarAction={
          <Button variant="brand" size="lg" className="h-12" onClick={() => setForm({ open: true })}>
            <Plus data-icon="inline-start" />
            Add Category
          </Button>
        }
        search={{ placeholder: "Search categories..." }}
        initialSorting={BY_NAME}
        isLoading={isPending}
        error={error?.message}
        onRetry={() => refetch()}
        emptyMessage="No categories saved yet."
      />

      <CategoryFormDialog
        open={form.open}
        onOpenChange={(open) => !open && setForm(close)}
        category={form.category}
      />

      <ConfirmDialog
        open={toDelete.open}
        onOpenChange={(open) => !open && setToDelete(close)}
        title="Delete this category?"
        description={
          <>
            <strong className="text-foreground">{toDelete.category?.name}</strong> leaves the store. Its products stay,
            but are no longer listed under it until you give them another category.
          </>
        }
        confirmLabel="Delete"
        destructive
        isPending={deleteCategory.isPending}
        onConfirm={() => {
          if (toDelete.category) {
            deleteCategory.mutate(toDelete.category.id, { onSuccess: () => setToDelete(close) });
          }
        }}
      />
    </>
  );
};

export default CategoriesManager;
