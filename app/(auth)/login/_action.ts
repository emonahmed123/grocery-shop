"use server";

import axios from "axios";

import { saveAuthCookies } from "@/lib/authCookies";
import { getApiErrorMessage } from "@/lib/axios/httpClient";
import { loginUser } from "@/services/auth.services";
import type { ApiResult } from "@/types/api.types";
import type { AuthUser } from "@/types/auth.types";
import { type ILoginPayload, loginZodSchema } from "@/zod/auth.validation";

// The backend answers "user not found" (404) and "wrong password" (403)
// differently; one message stops the form from revealing which emails exist.
const INVALID_CREDENTIAL_STATUSES = [401, 403, 404];

export async function loginAction(payload: ILoginPayload): Promise<ApiResult<AuthUser>> {
  // The browser can be bypassed, so validate again on the server.
  const parsed = loginZodSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { rememberMe, ...credentials } = parsed.data;

  try {
    const { data, message } = await loginUser(credentials);
    await saveAuthCookies(data, rememberMe);

    return { success: true, message: message || "Logged in successfully", data: data.user };
  } catch (error) {
    if (axios.isAxiosError(error) && INVALID_CREDENTIAL_STATUSES.includes(error.response?.status ?? 0)) {
      return { success: false, message: "Invalid email or password" };
    }
    return { success: false, message: getApiErrorMessage(error, "Login failed") };
  }
}
