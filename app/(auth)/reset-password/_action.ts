"use server";

import axios from "axios";

import { getApiErrorMessage } from "@/lib/axios/httpClient";
import { isMissingEndpoint, resetPassword } from "@/services/auth.services";
import type { ApiResult } from "@/types/api.types";
import { type IResetPasswordPayload, resetPasswordZodSchema } from "@/zod/auth.validation";

// Statuses the backend would use for a used, expired or forged token.
const INVALID_TOKEN_STATUSES = [400, 401, 403, 404];

export async function resetPasswordAction(payload: IResetPasswordPayload): Promise<ApiResult<null>> {
  // The browser can be bypassed, so validate again on the server.
  const parsed = resetPasswordZodSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    await resetPassword(parsed.data);
    return { success: true, message: "Your password has been reset. Please sign in.", data: null };
  } catch (error) {
    if (isMissingEndpoint(error)) {
      return { success: false, message: "Password reset is not available yet" };
    }
    if (axios.isAxiosError(error) && INVALID_TOKEN_STATUSES.includes(error.response?.status ?? 0)) {
      return { success: false, message: "This reset link is invalid or has expired. Please request a new one." };
    }
    return { success: false, message: getApiErrorMessage(error, "Could not reset your password") };
  }
}
