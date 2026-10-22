"use server";

import axios from "axios";

import { getApiErrorMessage } from "@/lib/axios/httpClient";
import { changePassword } from "@/services/account.services";
import type { ApiResult } from "@/types/api.types";
import { changePasswordZodSchema, type IChangePasswordPayload } from "@/zod/account.validation";

export async function changePasswordAction(payload: IChangePasswordPayload): Promise<ApiResult<null>> {
  // The browser can be bypassed, so validate again on the server.
  const parsed = changePasswordZodSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    await changePassword(parsed.data);
    return { success: true, message: "Password changed successfully", data: null };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return { success: false, message: "Changing the password is not available yet" };
    }
    return { success: false, message: getApiErrorMessage(error, "Could not change your password") };
  }
}
