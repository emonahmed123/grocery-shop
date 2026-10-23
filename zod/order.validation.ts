import { z } from "zod";

import { DIVISIONS } from "@/lib/districts";

const DISTRICTS = new Set<string>(DIVISIONS.flatMap((division) => division.districts));

/** Bangladeshi mobile number, with or without the +88 country code. */
const BD_MOBILE = /^(?:\+?88)?01[3-9]\d{8}$/;

// Prices are not sent: the backend works out every price and the total itself.
export const placeOrderZodSchema = z.object({
  items: z
    .array(
      z.object({
        product: z.string().regex(/^[0-9a-f]{24}$/i, "A product in your cart is no longer sold"),
        quantity: z.number().int().min(1).max(1000),
        variation: z.string().optional(),
      }),
    )
    .min(1, "Your cart is empty"),
  shippingAddress: z.object({
    district: z.string().refine((district) => DISTRICTS.has(district), "Select your district"),
    address: z.string().trim().min(5, "Enter your full delivery address").max(200, "The address is too long"),
    phone: z
      .string()
      .transform((phone) => phone.replace(/[\s-]/g, ""))
      .pipe(z.string().regex(BD_MOBILE, "Enter a valid mobile number, e.g. 01712345678")),
  }),
  deliveryInstructions: z.object({
    note: z.string().trim().max(500, "The note is too long").optional(),
    leaveAtDoor: z.boolean(),
  }),
  paymentMethod: z.literal("cash-on-delivery", "Only cash on delivery is available right now"),
});

export type IPlaceOrderPayload = z.input<typeof placeOrderZodSchema>;
