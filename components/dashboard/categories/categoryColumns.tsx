"use client";

import { ProductThumb } from "@/components/dashboard/products/productColumns";
import { createDataTableColumns } from "@/components/shared/table/tableFeatures";
import type { AdminCategory } from "@/types/dashboard.types";

const column = createDataTableColumns<AdminCategory>();

// Module scope keeps the column array stable between renders.
export const categoryColumns = column.columns([
  column.accessor("name", {
    header: "Category",
    sortFn: "text",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <ProductThumb src={row.original.image} />
        <div className="min-w-0">
          <p className="max-w-56 truncate font-medium text-foreground">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">/{row.original.slug}</p>
        </div>
      </div>
    ),
  }),
  column.accessor((category) => category.children.map((child) => child.name).join(", "), {
    id: "children",
    header: "Sub categories",
    enableSorting: false,
    cell: ({ row }) => {
      const names = row.original.children.map((child) => child.name);
      return names.length === 0 ? (
        <span className="text-muted-foreground">—</span>
      ) : (
        <span className="block max-w-72 truncate" title={names.join(", ")}>
          {names.length} · {names.join(", ")}
        </span>
      );
    },
  }),
  column.accessor((category) => category.icon ?? "", {
    id: "icon",
    header: "Icon",
    enableSorting: false,
    enableGlobalFilter: false,
    cell: ({ getValue }) =>
      getValue() ? <ProductThumb src={getValue()} className="size-8" /> : <span className="text-muted-foreground">—</span>,
  }),
]);
