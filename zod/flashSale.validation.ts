import { z } from "zod";

const OBJECT_ID = /^[a-f\d]{24}$/i;
const isDate = (value: string) => value !== "" && !Number.isNaN(Date.parse(value));

// `startAt`/`endAt` come from <input type="datetime-local"> (local time,
// no zone); the form converts them to ISO before sending.
export const flashSaleZodSchema = z
  .object({
    products: z.array(z.string().regex(OBJECT_ID, "Invalid product")).min(1, "Select at least one product"),
    discountPercentage: z
      .string()
      .refine((value) => Number.isInteger(Number(value)) && Number(value) >= 1 && Number(value) <= 99, "Discount must be a whole number from 1 to 99"),
    startAt: z.string().refine(isDate, "Choose when the sale starts"),
    endAt: z.string().refine(isDate, "Choose when the sale ends"),
    quantityLimit: z
      .string()
      .refine((value) => value.trim() === "" || (Number.isInteger(Number(value)) && Number(value) >= 1), "Limit must be a whole number, 1 or more"),
  })
  .refine((data) => !isDate(data.startAt) || !isDate(data.endAt) || new Date(data.endAt) > new Date(data.startAt), {
    message: "The sale must end after it starts",
    path: ["endAt"],
  })
  .refine((data) => !isDate(data.endAt) || new Date(data.endAt) > new Date(), {
    message: "The end time must be in the future",
    path: ["endAt"],
  });

export type IFlashSaleFormValues = z.infer<typeof flashSaleZodSchema>;

export interface IFlashSalePayload {
  products: string[];
  discountPercentage: number;
  startAt: string;
  endAt: string;
  quantityLimit?: number;
}

export const toFlashSalePayload = (values: IFlashSaleFormValues): IFlashSalePayload => ({
  products: values.products,
  discountPercentage: Number(values.discountPercentage),
  startAt: new Date(values.startAt).toISOString(),
  endAt: new Date(values.endAt).toISOString(),
  quantityLimit: values.quantityLimit.trim() ? Number(values.quantityLimit) : undefined,
});

/**
 * Server-side check of what the form sends. Dates are converted to ISO in the
 * browser, because only the browser knows the admin's time zone.
 */
export const flashSalePayloadZodSchema = z
  .object({
    products: z.array(z.string().regex(OBJECT_ID, "Invalid product")).min(1, "Select at least one product"),
    discountPercentage: z.number().int().min(1).max(99),
    startAt: z.iso.datetime(),
    endAt: z.iso.datetime(),
    quantityLimit: z.number().int().min(1).optional(),
  })
  .refine((data) => new Date(data.endAt) > new Date(data.startAt), {
    message: "The sale must end after it starts",
    path: ["endAt"],
  });
