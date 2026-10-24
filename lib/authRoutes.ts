/** Pages only guests should see; logged-in users are sent home. */
export const authRoutes = ["/login", "/register"];

/** Pages that need a logged-in user; guests are sent to login. */
export const protectedRoutes = ["/checkout", "/my-account", "/dashboard"];

/** Pages only admins may open; other users are sent to their account. */
export const adminRoutes = ["/dashboard"];

const matches = (pathname: string, routes: string[]) =>
  routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

export const isAuthRoute = (pathname: string) => matches(pathname, authRoutes);

export const isProtectedRoute = (pathname: string) => matches(pathname, protectedRoutes);

export const isAdminRoute = (pathname: string) => matches(pathname, adminRoutes);

const SAME_SITE_BASE = "http://same-site.invalid";

/**
 * Only same-site paths are allowed. The path is resolved the way the browser
 * will resolve it, so tricks like `//evil.com`, `/\evil.com` or `/<tab>/evil.com`
 * cannot turn the login page into an open redirect.
 */
export function getSafeRedirect(path: string | null | undefined, fallback = "/") {
  if (!path?.startsWith("/")) return fallback;

  let url: URL;
  try {
    url = new URL(path, SAME_SITE_BASE);
  } catch {
    return fallback;
  }
  if (url.origin !== SAME_SITE_BASE || isAuthRoute(url.pathname)) return fallback;

  return `${url.pathname}${url.search}${url.hash}`;
}

/** `?redirect=` may repeat (`string[]`); only a single value is trusted. */
export const readRedirectParam = (value: string | string[] | undefined) =>
  typeof value === "string" ? value : undefined;
