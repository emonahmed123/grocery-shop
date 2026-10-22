"use server";

import axios from "axios";

import { saveAuthCookies } from "@/lib/authCookies";
import { getApiErrorMessage } from "@/lib/axios/httpClient";
import { loginUser, registerUser } from "@/services/auth.services";
import type { ApiResult } from "@/types/api.types";
import type { AuthUser } from "@/types/auth.types";
import { type IRegisterPayload, registerZodSchema } from "@/zod/auth.validation";

export async function registerAction(payload: IRegisterPayload): Promise<ApiResult<AuthUser | null>> {
  // The browser can be bypassed, so validate again on the server.
  const parsed = registerZodSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { rememberMe, ...account } = parsed.data;

  try {
    await registerUser(account);
  } catch (error) {
    const isDuplicate =
      axios.isAxiosError<{ message?: string }>(error) &&
      error.response?.data?.message === "Duplicate Error";
    return {
      success: false,
      message: isDuplicate
        ? "An account with this email already exists"
        : getApiErrorMessage(error, "Registration failed"),
    };
  }

  // Signup returns no tokens, so log in with the same credentials to save the
  // user a second form. `null` tells the form to send them to the login page.
  try {
    const { data } = await loginUser({ email: account.email, password: account.password });
    await saveAuthCookies(data, rememberMe);
    return { success: true, message: "Account created successfully", data: data.user };
  } catch {
    return { success: true, message: "Account created successfully", data: null };
  }
}
