import { type NextRequest, NextResponse } from "next/server";

import { isAuthRoute, isProtectedRoute } from "@/lib/authRoutes";
import { AUTH_COOKIES, getAuthCookieEntries, isTokenExpired, isTokenExpiringSoon } from "@/lib/tokenUtils";
import { refreshTokens } from "@/services/auth.services";

// This is a UX gate: it decides where to send people before a page renders.
// Real authorization still happens in the backend on every API call.
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const accessToken = request.cookies.get(AUTH_COOKIES.accessToken)?.value;
  const refreshToken = request.cookies.get(AUTH_COOKIES.refreshToken)?.value;

  let isLoggedIn = Boolean(accessToken && !isTokenExpired(accessToken));
  let cookieEntries: ReturnType<typeof getAuthCookieEntries> = [];
  let clearCookies = false;

  // Swap the refresh token for a new pair shortly before the access token runs
  // out, so the page and any server action in this request see fresh tokens.
  const needsRefresh = !accessToken || isTokenExpiringSoon(accessToken);
  if (needsRefresh && refreshToken && !isTokenExpired(refreshToken)) {
    const result = await refreshTokens(refreshToken);
    if (result.status === "refreshed") {
      const rememberMe = request.cookies.get(AUTH_COOKIES.rememberMe)?.value === "1";
      cookieEntries = getAuthCookieEntries(result.tokens, rememberMe);
      isLoggedIn = true;
    } else if (result.status === "rejected") {
      isLoggedIn = false;
      clearCookies = true;
    }
    // "error" (backend unreachable) keeps whatever the current access token allows.
  } else if (accessToken && !isLoggedIn) {
    // Expired and nothing to refresh it with: drop the dead cookies.
    clearCookies = true;
  }

  let response: NextResponse;
  if (isAuthRoute(pathname) && isLoggedIn) {
    response = NextResponse.redirect(new URL("/", request.url));
  } else if (isProtectedRoute(pathname) && !isLoggedIn) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", `${pathname}${search}`);
    response = NextResponse.redirect(loginUrl);
  } else {
    // Mirror cookie changes onto the forwarded request, so the page and server
    // actions in this same request already see the new state.
    for (const [name, value] of cookieEntries) request.cookies.set(name, value);
    if (clearCookies) {
      for (const name of Object.values(AUTH_COOKIES)) request.cookies.delete(name);
    }
    response = NextResponse.next({ request: { headers: request.headers } });
  }

  for (const [name, value, options] of cookieEntries) response.cookies.set(name, value, options);
  if (clearCookies) {
    for (const name of Object.values(AUTH_COOKIES)) response.cookies.delete(name);
  }

  return response;
}

export const config = {
  // Skip API routes, Next internals and files such as images or favicon.ico.
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
