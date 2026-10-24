"use server";

import axios from "axios";
import { cookies } from "next/headers";

import { clearAuthCookies } from "@/lib/authCookies";
import { AUTH_COOKIES } from "@/lib/tokenUtils";
import { getMe, logout } from "@/services/auth.services";
import type { AuthUser } from "@/types/auth.types";

/** The logged-in user, or `null` for guests and expired sessions. */
export async function getMeAction(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  if (!cookieStore.has(AUTH_COOKIES.accessToken)) return null;

  try {
    const response = await getMe();
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) return null;
    throw error;
  }
}

export async function logoutAction() {
  // The backend is told first, while the token is still in the cookie.
  await logout();
  await clearAuthCookies();
}
