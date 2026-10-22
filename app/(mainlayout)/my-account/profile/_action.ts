"use server";

import { getApiErrorMessage } from "@/lib/axios/httpClient";
import { updateProfile } from "@/services/account.services";
import type { ApiResult } from "@/types/api.types";
import type { AuthUser } from "@/types/auth.types";
import { type IProfilePayload, profileZodSchema } from "@/zod/account.validation";

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
