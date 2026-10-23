"use client";

import { useForm } from "@tanstack/react-form";
import { useRef, useState } from "react";

import AppField, { getFieldError } from "@/components/form/AppField";
import AppSubmitButton from "@/components/form/AppSubmitButton";
import AppTextareaField from "@/components/form/AppTextareaField";
import ImageInput from "@/components/form/ImageInput";
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
import { useSaveCategory } from "@/hooks/useDashboard";
import type { AdminCategory } from "@/types/dashboard.types";
import { categoryZodSchema, type ICategoryFormValues } from "@/zod/category.validation";
import { toSlug } from "@/zod/product.validation";

const emptyValues: ICategoryFormValues = { name: "", slug: "", image: "", icon: "", children: "" };

const toFormValues = (category: AdminCategory): ICategoryFormValues => ({
  name: category.name,
  slug: category.slug,
  image: category.image,
  icon: category.icon ?? "",
  children: category.children.map((child) => child.name).join("\n"),
});

/** A single-image field: the form keeps a string, the image input works with a list. */
const toList = (value: string) => (value ? [value] : []);

const CategoryForm = ({ category, onDone }: { category?: AdminCategory; onDone: () => void }) => {
  const save = useSaveCategory();
  const isEditing = Boolean(category);
  // Saving waits for running uploads, or their images would be missing.
  const [uploads, setUploads] = useState(0);
  const trackUpload = (busy: boolean) => setUploads((count) => count + (busy ? 1 : -1));
  // The last slug made from the name; once the admin types a different one, it is theirs.
  const autoSlug = useRef("");

  const form = useForm({
    defaultValues: category ? toFormValues(category) : emptyValues,
    validators: { onChange: categoryZodSchema },
    onSubmit: ({ value }) => save.mutate({ id: category?.id, values: value }, { onSuccess: onDone }),
  });

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-col gap-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <form.Field
          name="name"
          listeners={{
            // New categories get a slug from the name until the admin edits it.
            onChange: ({ value }) => {
              if (isEditing || form.getFieldValue("slug") !== autoSlug.current) return;
              autoSlug.current = toSlug(value);
              form.setFieldValue("slug", autoSlug.current);
            },
          }}
        >
          {(field) => <AppField field={field} label="Category Name" placeholder="Fresh Fruits" />}
        </form.Field>
        <form.Field name="slug">
          {(field) => <AppField field={field} label="Slug" placeholder="fresh-fruits" />}
        </form.Field>
      </div>

      <form.Field name="image">
        {(field) => (
          <ImageInput
            label="Image"
            value={toList(field.state.value)}
            onChange={(update) => field.handleChange((current) => update(toList(current))[0] ?? "")}
            onBlur={field.handleBlur}
            error={getFieldError(field)}
            hint="Shown in the round category list on the home page."
            onBusyChange={trackUpload}
          />
        )}
      </form.Field>

      <form.Field name="icon">
        {(field) => (
          <ImageInput
            label="Icon (optional)"
            value={toList(field.state.value)}
            onChange={(update) => field.handleChange((current) => update(toList(current))[0] ?? "")}
            onBlur={field.handleBlur}
            error={getFieldError(field)}
            hint="Small picture beside the name in the search filters. The image is used when empty."
            onBusyChange={trackUpload}
          />
        )}
      </form.Field>

      <form.Field name="children">
        {(field) => (
          <AppTextareaField
            field={field}
            label="Sub categories (optional)"
            placeholder={"One per line\nApples\nCitrus"}
            rows={4}
          />
        )}
      </form.Field>

      {isEditing && (
        <p className="text-xs text-muted-foreground">
          Products are linked by slug: changing it moves this category&apos;s products out of it until they are edited.
        </p>
      )}

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
              <AppSubmitButton
                isPending={save.isPending || uploads > 0}
                pendingLabel={uploads > 0 ? "Uploading..." : "Saving..."}
                disabled={!canSubmit}
              >
                {isEditing ? "Save Changes" : "Add Category"}
              </AppSubmitButton>
            </div>
          )}
        </form.Subscribe>
      </DialogFooter>
    </form>
  );
};

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Edit this category; leave empty to add a new one. */
  category?: AdminCategory;
}

/** One modal for both adding and editing a category. */
const CategoryFormDialog = ({ open, onOpenChange, category }: CategoryFormDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-h-svh overflow-y-auto sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>{category ? "Edit Category" : "Add Category"}</DialogTitle>
        <DialogDescription>
          {category ? "Update how this category shows in the store." : "Add a category for products to be listed in."}
        </DialogDescription>
      </DialogHeader>
      {/* A fresh form per category (or per "add"), so old values never leak in. */}
      <CategoryForm key={category?.id ?? "new"} category={category} onDone={() => onOpenChange(false)} />
    </DialogContent>
  </Dialog>
);

export default CategoryFormDialog;
