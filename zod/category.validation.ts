import { z } from "zod";

import { SLUG_PATTERN, splitList, toSlug } from "@/zod/product.validation";

const childNames = (value: string) => splitList(value, /\n/);

// Form fields stay strings, like the product form; `toCategoryPayload` makes the backend shape.
export const categoryZodSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    slug: z.string().trim().regex(SLUG_PATTERN, "Use lower-case letters, numbers and dashes, e.g. fresh-fruits"),
    image: z.url("Add an image: upload one or paste a link"),
    icon: z
      .string()
      .trim()
      .refine((value) => value === "" || URL.canParse(value), "Enter a valid icon link"),
    /** One sub category name per line. */
    children: z
      .string()
      .refine((value) => childNames(value).every((name) => toSlug(name) !== ""), "Each sub category needs letters or numbers"),
  })
  .refine(
    (data) => {
      const slugs = childNames(data.children).map(toSlug);
      return new Set(slugs).size === slugs.length;
    },
    { message: "Two sub categories have the same name", path: ["children"] },
  );

export type ICategoryFormValues = z.infer<typeof categoryZodSchema>;

export interface ICategoryPayload {
  name: string;
  slug: string;
  image: { thumbnail: string; original: string };
  /** Empty clears the icon. */
  icon: string;
  children: { name: string; slug: string }[];
}

export const toCategoryPayload = (values: ICategoryFormValues): ICategoryPayload => ({
  name: values.name.trim(),
  slug: values.slug.trim(),
  // One link serves both sizes; imgbb links load fast enough for the round thumbnails.
  image: { thumbnail: values.image.trim(), original: values.image.trim() },
  icon: values.icon.trim(),
  children: childNames(values.children).map((name) => ({ name, slug: toSlug(name) })),
});
