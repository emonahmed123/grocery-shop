import { z } from "zod";

// Shared by the form (instant feedback) and the server action (the browser
// can be bypassed), so both sides always apply the same rules.
/** Password rules for every new password: sign up, reset and change. */
export const newPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Za-z]/, "Password must contain a letter")
  .regex(/[0-9]/, "Password must contain a number");

export const loginZodSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(),
});

export const registerZodSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.email("Enter a valid email address"),
  password: newPasswordSchema,
  rememberMe: z.boolean(),
});

export const forgotPasswordZodSchema = z.object({
  email: z.email("Enter a valid email address"),
});

export const resetPasswordZodSchema = z
  .object({
    token: z.string().min(1, "This reset link is invalid"),
    password: newPasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ILoginPayload = z.infer<typeof loginZodSchema>;
export type IRegisterPayload = z.infer<typeof registerZodSchema>;
export type IForgotPasswordPayload = z.infer<typeof forgotPasswordZodSchema>;
export type IResetPasswordPayload = z.infer<typeof resetPasswordZodSchema>;
