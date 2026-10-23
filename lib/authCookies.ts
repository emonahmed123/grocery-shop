import "server-only";

import { cookies } from "next/headers";

import { AUTH_COOKIES, getAuthCookieEntries } from "@/lib/tokenUtils";
import type { AuthTokens } from "@/types/auth.types";

// Plain server helpers, deliberately not "use server": every exported server
// action is a public endpoint, and nobody should be able to call these directly.

/** Writes the tokens as httpOnly cookies, out of reach of page JavaScript. */
export async function saveAuthCookies(tokens: AuthTokens, rememberMe: boolean) {
  const cookieStore = await cookies();
  for (const [name, value, options] of getAuthCookieEntries(tokens, rememberMe)) {
    cookieStore.set(name, value, options);
  }
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  for (const name of Object.values(AUTH_COOKIES)) {
    cookieStore.delete(name);
  }
}
