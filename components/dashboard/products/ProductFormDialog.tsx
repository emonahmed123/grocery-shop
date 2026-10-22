"use client";

import { useForm } from "@tanstack/react-form";
import { useRef } from "react";

import { ProductThumb } from "@/components/dashboard/products/productColumns";
import AppField, { getFieldError } from "@/components/form/AppField";
import AppSubmitButton from "@/components/form/AppSubmitButton";
import AppTextareaField from "@/components/form/AppTextareaField";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useCategories, useSaveProduct } from "@/hooks/useDashboard";
import type { AdminProduct, CategoryOption } from "@/types/dashboard.types";
import { type IProductFormValues, productZodSchema, splitList, toSlug } from "@/zod/product.validation";

const emptyValues: IProductFormValues = {
  name: "",
  slug: "",
  category: "",
  unit: "",
  description: "",
  price: "",
  salePrice: "",
  maxPrice: "",
  inStock: "",
  isAvailable: true,
  image: "",
  gallery: "",
  tags: "",
  variationName: "",
  variationValues: "",
};

const toFormValues = (product: AdminProduct): IProductFormValues => ({
  name: product.name,
  slug: product.slug,
  category: product.category,
  unit: product.unit,
  description: product.description,
  price: String(product.price),
  salePrice: product.salePrice === undefined ? "" : String(product.salePrice),
  maxPrice: product.maxPrice === undefined ? "" : String(product.maxPrice),
  inStock: product.inStock === null ? "" : String(product.inStock),
  isAvailable: product.isAvailable,
  image: product.image,
  gallery: product.gallery.join("\n"),
  tags: product.tags.join(", "),
  variationName: product.variations?.name ?? "",
  variationValues: product.variations?.values.join(", ") ?? "",
});

const FormSection = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <section className="grid gap-4 md:grid-cols-4 md:gap-6">
    <div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
    </div>
    <div className="grid gap-5 sm:grid-cols-2 md:col-span-3">{children}</div>
  </section>
);

interface ProductFormProps {
  product?: AdminProduct;
  categories: CategoryOption[];
  onDone: () => void;
}

const ProductForm = ({ product, categories, onDone }: ProductFormProps) => {
  const save = useSaveProduct();
  const isEditing = Boolean(product);
  // The last slug made from the name; once the admin types a different one, it is theirs.
  const autoSlug = useRef("");

  const form = useForm({
    defaultValues: product ? toFormValues(product) : emptyValues,
    validators: { onChange: productZodSchema },
    onSubmit: ({ value }) => save.mutate({ id: product?.id, values: value }, { onSuccess: onDone }),
  });

  // A product's current category stays selectable even if it is not in the list.
  const categoryOptions =
    product?.category && !categories.some((category) => category.slug === product.category)
      ? [...categories, { name: product.category, slug: product.category }]
      : categories;

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-col gap-6"
    >
      <FormSection title="Basic information" description="Name, web address and where the product is listed.">
        <div className="sm:col-span-2">
          <form.Field
            name="name"
            listeners={{
              // New products get a slug from the name until the admin edits it.
              onChange: ({ value }) => {
                if (isEditing || form.getFieldValue("slug") !== autoSlug.current) return;
                autoSlug.current = toSlug(value);
                form.setFieldValue("slug", autoSlug.current);
              },
            }}
          >
            {(field) => <AppField field={field} label="Product Name" placeholder="Organic Green Apple" />}
          </form.Field>
        </div>

        <form.Field name="slug">
          {(field) => <AppField field={field} label="Slug" placeholder="organic-green-apple" />}
        </form.Field>

        <form.Field name="category">
          {(field) => {
            const error = getFieldError(field);
            return (
              <div className="flex flex-col gap-2.5">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => {
                    field.handleChange(value);
                    field.handleBlur();
                  }}
                >
                  <SelectTrigger id="category" size="lg" className="w-full" aria-invalid={error !== null}>
                    <SelectValue placeholder="Choose a category" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {categoryOptions.map((category) => (
                      <SelectItem key={category.slug} value={category.slug}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {error && (
                  <p role="alert" className="text-sm text-destructive">
                    {error}
                  </p>
                )}
              </div>
            );
          }}
        </form.Field>

        <form.Field name="unit">
          {(field) => <AppField field={field} label="Unit" placeholder="1 kg, 500 g, 1 each" />}
        </form.Field>

        <div className="sm:col-span-2">
          <form.Field name="description">
            {(field) => (
              <AppTextareaField field={field} label="Description (optional)" placeholder="Crisp, sweet and freshly picked." />
            )}
          </form.Field>
        </div>
      </FormSection>

      <Separator />

      <FormSection title="Pricing & stock" description="Sale price shows as a discount. Max price is for products with options.">
        <form.Field name="price">
          {(field) => <AppField field={field} label="Price" type="number" min={0} step="any" placeholder="0.00" />}
        </form.Field>
        <form.Field name="salePrice">
          {(field) => (
            <AppField field={field} label="Sale Price (optional)" type="number" min={0} step="any" placeholder="0.00" />
          )}
        </form.Field>
        <form.Field name="maxPrice">
          {(field) => (
            <AppField field={field} label="Max Price (optional)" type="number" min={0} step="any" placeholder="0.00" />
          )}
        </form.Field>
        <form.Field name="inStock">
          {(field) => <AppField field={field} label="Stock" type="number" min={0} step={1} placeholder="0" />}
        </form.Field>

        <form.Field name="isAvailable">
          {(field) => (
            <div className="flex items-center justify-between gap-4 rounded-md border p-4 sm:col-span-2">
              <div>
                <Label htmlFor="isAvailable">Show in store</Label>
                <p className="mt-1 text-xs text-muted-foreground">Hidden products stay in the dashboard only.</p>
              </div>
              <Switch
                id="isAvailable"
                checked={field.state.value}
                onCheckedChange={(checked) => field.handleChange(checked)}
              />
            </div>
          )}
        </form.Field>
      </FormSection>

      <Separator />

      <FormSection title="Images" description="A main image, plus optional extra photos for the product page.">
        <div className="flex items-end gap-3 sm:col-span-2">
          <div className="min-w-0 flex-1">
            <form.Field name="image">
              {(field) => (
                <AppField field={field} label="Main Image URL" type="url" placeholder="https://example.com/apple.png" />
              )}
            </form.Field>
          </div>
          <form.Subscribe selector={(state) => state.values.image}>
            {(image) => <ProductThumb src={URL.canParse(image) ? image : ""} className="size-12" />}
          </form.Subscribe>
        </div>

        <div className="sm:col-span-2">
          <form.Field name="gallery">
            {(field) => (
              <AppTextareaField
                field={field}
                label="Gallery URLs (optional)"
                placeholder={"One image URL per line\nhttps://example.com/apple-2.png"}
                rows={3}
              />
            )}
          </form.Field>
          <form.Subscribe selector={(state) => state.values.gallery}>
            {(gallery) => {
              const urls = splitList(gallery, /\n/).filter((url) => URL.canParse(url));
              return urls.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {urls.map((url) => (
                    <ProductThumb key={url} src={url} className="size-12" />
                  ))}
                </div>
              ) : null;
            }}
          </form.Subscribe>
        </div>
      </FormSection>

      <Separator />

      <FormSection title="Tags & options" description="Tags help search. Add a variation if customers pick a size or weight.">
        <div className="sm:col-span-2">
          <form.Field name="tags">
            {(field) => (
              <AppField field={field} label="Tags (optional, comma separated)" placeholder="Fruits, Fresh food, Organic" />
            )}
          </form.Field>
        </div>
        <form.Field name="variationName">
          {(field) => <AppField field={field} label="Variation Name (optional)" placeholder="Weight" />}
        </form.Field>
        <form.Field name="variationValues">
          {(field) => <AppField field={field} label="Variation Options (comma separated)" placeholder="500 g, 1 kg, 2 kg" />}
        </form.Field>
      </FormSection>

      {save.error && (
        <Alert variant="destructive">
          <AlertDescription>{save.error.message}</AlertDescription>
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
            <div className="sm:w-44">
              <AppSubmitButton isPending={save.isPending} pendingLabel="Saving..." disabled={!canSubmit}>
                {isEditing ? "Save Changes" : "Add Product"}
              </AppSubmitButton>
            </div>
          )}
        </form.Subscribe>
      </DialogFooter>
    </form>
  );
};

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Edit this product; leave empty to add a new one. */
  product?: AdminProduct;
}

/** One modal for both adding and editing a product. */
const ProductFormDialog = ({ open, onOpenChange, product }: ProductFormDialogProps) => {
  const { data: categories = [] } = useCategories();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-svh overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
          <DialogDescription>
            {product
              ? "Update the details customers see for this product."
              : "Fill in the product details. Fields marked optional can be left empty."}
          </DialogDescription>
        </DialogHeader>
        {/* A fresh form per product (or per "add"), so old values never leak in. */}
        <ProductForm
          key={product?.id ?? "new"}
          product={product}
          categories={categories}
          onDone={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormDialog;
