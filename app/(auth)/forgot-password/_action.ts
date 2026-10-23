"use server";

import axios from "axios";

import { getApiErrorMessage } from "@/lib/axios/httpClient";
import { isMissingEndpoint, requestPasswordReset } from "@/services/auth.services";
import type { ApiResult } from "@/types/api.types";
import { forgotPasswordZodSchema, type IForgotPasswordPayload } from "@/zod/auth.validation";

export async function forgotPasswordAction(payload: IForgotPasswordPayload): Promise<ApiResult<null>> {
  // The browser can be bypassed, so validate again on the server.
  const parsed = forgotPasswordZodSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    await requestPasswordReset(parsed.data);
  } catch (error) {
    if (isMissingEndpoint(error)) {
      return { success: false, message: "Password reset is not available yet" };
    }
    // An unknown email gets the same answer as a known one, so the form
    // never reveals who has an account.
    if (!(axios.isAxiosError(error) && error.response?.status === 404)) {
      return { success: false, message: getApiErrorMessage(error, "Could not send the reset link") };
    }
  }

  return { success: true, message: "Reset link sent", data: null };
}
