import { type NextRequest, NextResponse } from "next/server";

import { isAdminRoute, isAuthRoute, isProtectedRoute } from "@/lib/authRoutes";
import { USER_ROLES } from "@/lib/roles";
import {
  AUTH_COOKIES,
  getAuthCookieEntries,
  isTokenExpired,
  isTokenExpiringSoon,
  verifyAccessToken,
} from "@/lib/tokenUtils";
import { refreshTokens } from "@/services/auth.services";

// This is a UX gate: it decides where to send people before a page renders.
// Real authorization still happens in the backend on every API call.
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const accessToken = request.cookies.get(AUTH_COOKIES.accessToken)?.value;
  const refreshToken = request.cookies.get(AUTH_COOKIES.refreshToken)?.value;

  // Only a token signed with the backend's secret counts, so a hand-made
  // cookie (say, one claiming the admin role) is treated as no login at all.
  const noSecret = !process.env.JWT_ACCESS_SECRET;
  if (noSecret) console.error("proxy: JWT_ACCESS_SECRET is not set, so no access token can be verified");

  let payload = accessToken ? verifyAccessToken(accessToken) : null;
  let isLoggedIn = payload !== null;
  let cookieEntries: ReturnType<typeof getAuthCookieEntries> = [];
  let clearCookies = false;

  // Swap the refresh token for a new pair when the access token is missing,
  // expired or forged, or shortly before it runs out, so the page and any
  // server action in this request see fresh tokens. Without the secret every
  // token would look bad, so refreshing would only hammer the backend.
  const needsRefresh = !noSecret && (!payload || isTokenExpiringSoon(accessToken!));
  if (needsRefresh && refreshToken && !isTokenExpired(refreshToken)) {
    const result = await refreshTokens(refreshToken);
    if (result.status === "refreshed") {
      const rememberMe = request.cookies.get(AUTH_COOKIES.rememberMe)?.value === "1";
      cookieEntries = getAuthCookieEntries(result.tokens, rememberMe);
      payload = verifyAccessToken(result.tokens.accessToken);
      if (!payload) console.error("proxy: a refreshed access token failed verification");
      isLoggedIn = payload !== null;
    } else if (result.status === "rejected") {
      isLoggedIn = false;
      clearCookies = true;
    }
    // "error" (backend unreachable) keeps whatever the current access token allows.
  } else if (accessToken && !isLoggedIn && !noSecret) {
    // Expired or forged, and nothing to refresh it with: drop the dead cookies.
    clearCookies = true;
  }

  let response: NextResponse;
  if (isAuthRoute(pathname) && isLoggedIn) {
    response = NextResponse.redirect(new URL("/", request.url));
  } else if (isProtectedRoute(pathname) && !isLoggedIn) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", `${pathname}${search}`);
    response = NextResponse.redirect(loginUrl);
  } else if (isAdminRoute(pathname) && payload?.role !== USER_ROLES.admin) {
    // The role comes from the verified token; the dashboard layout checks it
    // again against the backend.
    response = NextResponse.redirect(new URL("/my-account/profile", request.url));
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
