import { z } from "zod";

// Form fields stay strings (that is what inputs hold); `toProductPayload`
// turns them into the shapes the backend stores.

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const isNumber = (value: string) => value.trim() !== "" && Number.isFinite(Number(value));
const isEmpty = (value: string) => value.trim() === "";

/** "a, b , ,c" -> ["a", "b", "c"] */
export const splitList = (value: string, separator: RegExp = /,/) =>
  value
    .split(separator)
    .map((item) => item.trim())
    .filter(Boolean);

/** Lower-case, dash-separated: "Fresh Green Apple!" -> "fresh-green-apple". */
export const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s-]+/g, "-")
    .replace(/^-|-$/g, "");

const optionalPrice = z
  .string()
  .refine((value) => isEmpty(value) || (isNumber(value) && Number(value) >= 0), "Enter a valid price");

export const productZodSchema = z
  .object({
    name: z.string().trim().min(3, "Name must be at least 3 characters"),
    slug: z.string().trim().regex(SLUG, "Use lower-case letters, numbers and dashes, e.g. green-apple"),
    category: z.string().trim().min(1, "Choose a category"),
    unit: z.string().trim().min(1, "Unit is required, e.g. 1 kg"),
    description: z.string().trim(),
    price: z
      .string()
      .refine((value) => isNumber(value) && Number(value) > 0, "Price must be greater than 0"),
    salePrice: optionalPrice,
    maxPrice: optionalPrice,
    inStock: z
      .string()
      .refine((value) => isNumber(value) && Number.isInteger(Number(value)) && Number(value) >= 0, "Stock must be a whole number"),
    isAvailable: z.boolean(),
    image: z.url("Enter a valid image URL"),
    gallery: z
      .string()
      .refine((value) => splitList(value, /\n/).every((url) => URL.canParse(url)), "Each line must be a valid URL"),
    tags: z.string(),
    variationName: z.string().trim(),
    variationValues: z.string(),
  })
  .refine((data) => isEmpty(data.salePrice) || Number(data.salePrice) < Number(data.price), {
    message: "Sale price must be lower than the price",
    path: ["salePrice"],
  })
  .refine((data) => isEmpty(data.maxPrice) || Number(data.maxPrice) >= Number(data.price), {
    message: "Max price must be at least the price",
    path: ["maxPrice"],
  })
  .refine((data) => isEmpty(data.variationName) === (splitList(data.variationValues).length === 0), {
    message: "Give the variation both a name and its options",
    path: ["variationValues"],
  });

export type IProductFormValues = z.infer<typeof productZodSchema>;

export interface IProductPayload {
  name: string;
  slug: string;
  category: string;
  unit: string;
  description?: string;
  price: number;
  salePrice?: number;
  maxPrice?: number;
  inStock: number;
  isAvailable: boolean;
  image: string;
  gallery: string[];
  tags: string[];
  variations?: { name: string; values: string[] };
}

const optionalNumber = (value: string) => (isEmpty(value) ? undefined : Number(value));

export const toProductPayload = (values: IProductFormValues): IProductPayload => ({
  name: values.name.trim(),
  slug: values.slug.trim(),
  category: values.category.trim(),
  unit: values.unit.trim(),
  description: values.description.trim() || undefined,
  price: Number(values.price),
  salePrice: optionalNumber(values.salePrice),
  maxPrice: optionalNumber(values.maxPrice),
  inStock: Number(values.inStock),
  isAvailable: values.isAvailable,
  image: values.image.trim(),
  gallery: splitList(values.gallery, /\n/),
  tags: splitList(values.tags),
  variations: values.variationName.trim()
    ? { name: values.variationName.trim(), values: splitList(values.variationValues) }
    : undefined,
});
