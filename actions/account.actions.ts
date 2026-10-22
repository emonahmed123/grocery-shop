"use server";

import { cookies } from "next/headers";

import { saveAuthCookies } from "@/lib/authCookies";
import { getApiErrorMessage } from "@/lib/axios/httpClient";
import { AUTH_COOKIES } from "@/lib/tokenUtils";
import { changePassword, updateProfile } from "@/services/account.services";
import { isMissingEndpoint } from "@/services/auth.services";
import type { ApiResult } from "@/types/api.types";
import type { AuthUser } from "@/types/auth.types";
import {
  changePasswordZodSchema,
  type IChangePasswordPayload,
  type IProfilePayload,
  profileZodSchema,
} from "@/zod/account.validation";

// Account actions every signed-in user has, whatever their role. The store's
// "My Account" pages and the admin dashboard both render the same forms, so
// the actions live here rather than under one of those routes.

export async function updateProfileAction(payload: IProfilePayload): Promise<ApiResult<AuthUser>> {
  // The browser can be bypassed, so validate again on the server.
  const parsed = profileZodSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const user = await updateProfile(parsed.data);
    return { success: true, message: "Profile updated successfully", data: user };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error, "Could not update your profile") };
  }
}

export async function changePasswordAction(payload: IChangePasswordPayload): Promise<ApiResult<null>> {
  const parsed = changePasswordZodSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const tokens = await changePassword(parsed.data);

    // The old token stops working after the change; keep the user signed in
    // with the new pair, under the same "remember me" choice as before.
    if (tokens?.accessToken) {
      const rememberMe = (await cookies()).get(AUTH_COOKIES.rememberMe)?.value === "1";
      await saveAuthCookies(tokens, rememberMe);
    }

    return { success: true, message: "Password changed successfully", data: null };
  } catch (error) {
    if (isMissingEndpoint(error)) {
      return { success: false, message: "Changing the password is not available yet" };
    }
    return { success: false, message: getApiErrorMessage(error, "Could not change your password") };
  }
}
