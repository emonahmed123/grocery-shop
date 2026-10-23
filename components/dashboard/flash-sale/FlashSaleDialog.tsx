"use client";

import { useForm } from "@tanstack/react-form";
import { Check, Search, X } from "lucide-react";
import { useEffect, useState } from "react";

import { FlashSaleBadge } from "@/components/dashboard/products/ProductBadges";
import { ProductThumb } from "@/components/dashboard/products/productColumns";
import AppField, { getFieldError } from "@/components/form/AppField";
import AppSubmitButton from "@/components/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminProducts, useSetFlashSale } from "@/hooks/useDashboard";
import { formatPrice } from "@/lib/assets";
import { getFlashPrice, toDateTimeLocal } from "@/lib/flashSale";
import type { AdminProduct } from "@/types/dashboard.types";
import { flashSaleZodSchema, type IFlashSaleFormValues, toFlashSalePayload } from "@/zod/flashSale.validation";

const PICKER_PAGE_SIZE = 20;

/** Searchable product list with checkboxes; keeps chosen products across searches. */
const ProductPicker = ({
  selected,
  onToggle,
}: {
  selected: Map<string, AdminProduct>;
  onToggle: (product: AdminProduct) => void;
}) => {
  const [input, setInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setSearchTerm(input.trim()), 300);
    return () => clearTimeout(timer);
  }, [input]);

  const { data, isPending, isFetching } = useAdminProducts({
    page: 1,
    limit: PICKER_PAGE_SIZE,
    sort: "name",
    searchTerm: searchTerm || undefined,
  });
  const products = data?.data ?? [];

  return (
    <div className="flex flex-col gap-2">
      <InputGroup className="h-11">
        <InputGroupAddon>
          <Search aria-hidden="true" />
        </InputGroupAddon>
        <InputGroupInput
          type="search"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Search products to add..."
          aria-label="Search products"
        />
      </InputGroup>

      <ul
        className="max-h-64 divide-y overflow-y-auto rounded-md border"
        aria-label="Products"
        aria-busy={isFetching}
      >
        {isPending &&
          Array.from({ length: 4 }, (_, index) => (
            <li key={index} className="flex items-center gap-3 p-3">
              <Skeleton className="size-10" />
              <Skeleton className="h-4 flex-1" />
            </li>
          ))}
        {!isPending && products.length === 0 && (
          <li className="p-6 text-center text-sm text-muted-foreground">No products found.</li>
        )}
        {products.map((product) => {
          const isSelected = selected.has(product.id);
          return (
            <li key={product.id}>
              <button
                type="button"
                onClick={() => onToggle(product)}
                aria-pressed={isSelected}
                className="group flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-fill-thumbnail aria-pressed:bg-brand/5"
              >
                <span
                  className="flex size-5 shrink-0 items-center justify-center rounded border group-aria-pressed:border-brand group-aria-pressed:bg-brand group-aria-pressed:text-brand-foreground"
                  aria-hidden="true"
                >
                  {isSelected && <Check className="size-3.5" aria-hidden="true" />}
                </span>
                <ProductThumb src={product.image} className="size-10" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground">{product.name}</span>
                  <span className="text-xs text-muted-foreground">{formatPrice(product.price)}</span>
                </span>
                <FlashSaleBadge flashSale={product.flashSale} />
              </button>
            </li>
          );
        })}
      </ul>
      {data && data.meta.total > products.length && (
        <p className="text-xs text-muted-foreground">
          Showing {products.length} of {data.meta.total}. Search to find others.
        </p>
      )}
    </div>
  );
};

const defaultValues = (): IFlashSaleFormValues => {
  const start = new Date();
  start.setSeconds(0, 0);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return {
    products: [],
    discountPercentage: "20",
    startAt: toDateTimeLocal(start),
    endAt: toDateTimeLocal(end),
    quantityLimit: "",
  };
};

const FlashSaleForm = ({ onDone }: { onDone: () => void }) => {
  const setFlashSale = useSetFlashSale();
  // Product details for the chips; the form itself only keeps the ids.
  const [selected, setSelected] = useState(() => new Map<string, AdminProduct>());

  const form = useForm({
    defaultValues: defaultValues(),
    validators: { onChange: flashSaleZodSchema },
    // Converted here, in the browser, which knows the admin's time zone.
    onSubmit: ({ value }) => setFlashSale.mutate(toFlashSalePayload(value), { onSuccess: onDone }),
  });

  const toggle = (product: AdminProduct) => {
    const next = new Map(selected);
    if (next.has(product.id)) next.delete(product.id);
    else next.set(product.id, product);
    setSelected(next);
    form.setFieldValue("products", [...next.keys()]);
  };

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-col gap-5"
    >
      <form.Field name="products">
        {(field) => {
          const error = getFieldError(field);
          return (
            <div className="flex flex-col gap-2.5">
              <Label>Products</Label>
              {selected.size > 0 && (
                <ul className="flex flex-wrap gap-1.5" aria-label="Selected products">
                  {[...selected.values()].map((product) => (
                    <li key={product.id}>
                      <Badge variant="secondary">
                        {product.name}
                        <button
                          type="button"
                          onClick={() => toggle(product)}
                          aria-label={`Remove ${product.name}`}
                          className="-mr-1 rounded-full hover:text-destructive"
                        >
                          <X className="size-3" />
                        </button>
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
              <ProductPicker
                selected={selected}
                onToggle={(product) => {
                  toggle(product);
                  field.handleBlur();
                }}
              />
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
            </div>
          );
        }}
      </form.Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <form.Field name="discountPercentage">
          {(field) => <AppField field={field} label="Discount (%)" type="number" min={1} step={1} placeholder="20" />}
        </form.Field>
        <form.Field name="quantityLimit">
          {(field) => (
            <AppField field={field} label="Quantity Limit (optional)" type="number" min={1} step={1} placeholder="No limit" />
          )}
        </form.Field>
        <form.Field name="startAt">
          {(field) => <AppField field={field} label="Starts" type="datetime-local" />}
        </form.Field>
        <form.Field name="endAt">
          {(field) => <AppField field={field} label="Ends" type="datetime-local" />}
        </form.Field>
      </div>

      <form.Subscribe selector={(state) => state.values.discountPercentage}>
        {(discount) => {
          const percent = Number(discount);
          const sample = [...selected.values()][0];
          return sample && percent >= 1 && percent <= 99 ? (
            <p className="rounded-md bg-brand/5 px-4 py-3 text-sm text-foreground">
              {sample.name}: <span className="text-muted-foreground line-through">{formatPrice(sample.price)}</span>{" "}
              <span className="font-semibold text-brand">{formatPrice(getFlashPrice(sample.price, percent))}</span>
            </p>
          ) : null;
        }}
      </form.Subscribe>

      <p className="text-xs text-muted-foreground">
        A product that is already on a flash sale gets this one instead, and its sold count starts again from zero.
      </p>

      {setFlashSale.error && (
        <Alert variant="destructive">
          <AlertDescription>{setFlashSale.error.message}</AlertDescription>
        </Alert>
      )}

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" size="lg" className="h-12 sm:w-32">
            Cancel
          </Button>
        </DialogClose>
        <form.Subscribe selector={(state) => state.canSubmit}>
          {(canSubmit) => (
            <div className="sm:w-48">
              <AppSubmitButton isPending={setFlashSale.isPending} pendingLabel="Saving..." disabled={!canSubmit}>
                Start Flash Sale
              </AppSubmitButton>
            </div>
          )}
        </form.Subscribe>
      </DialogFooter>
    </form>
  );
};

const FlashSaleDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-h-svh overflow-y-auto sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>Create Flash Sale</DialogTitle>
        <DialogDescription>Pick products, set the discount and choose when the sale runs.</DialogDescription>
      </DialogHeader>
      {/* Radix unmounts closed dialogs, so every opening starts a fresh form. */}
      <FlashSaleForm onDone={() => onOpenChange(false)} />
    </DialogContent>
  </Dialog>
);

export default FlashSaleDialog;
