import { z } from "zod";

export const reviewZodSchema = z.object({
  rating: z.number().int().min(1, "Pick a star rating").max(5),
  review: z.string().trim().min(3, "Please write a few words").max(1000, "The review is too long"),
});

export type IReviewFormValues = z.input<typeof reviewZodSchema>;
