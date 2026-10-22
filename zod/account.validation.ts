import { z } from "zod";

// Shared by the forms (instant feedback) and the server actions (the browser
// can be bypassed), so both sides always apply the same rules.
export const profileZodSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
});

export const changePasswordZodSchema = z
  .object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Za-z]/, "Password must contain a letter")
      .regex(/[0-9]/, "Password must contain a number"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.oldPassword, {
    message: "New password must be different from the old one",
    path: ["newPassword"],
  });

export type IProfilePayload = z.infer<typeof profileZodSchema>;
export type IChangePasswordPayload = z.infer<typeof changePasswordZodSchema>;
