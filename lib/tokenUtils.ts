import type { AuthTokens } from "@/types/auth.types";

export const AUTH_COOKIES = {
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  rememberMe: "rememberMe",
} as const;

type CookieOptions = {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax";
  path: string;
  maxAge?: number;
};

/** Reads a JWT's payload (the middle, base64url part) without verifying it. */
function decodeJwtPayload(token: string): { exp?: number } | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const decoded: unknown = JSON.parse(json);
    return decoded && typeof decoded === "object" ? decoded : null;
  } catch {
    return null;
  }
}

/**
 * Seconds until the token's `exp`. The signature is not checked here: that is
 * the backend's job, so this frontend never needs the JWT secret.
 */
export function getTokenSecondsRemaining(token: string) {
  const payload = decodeJwtPayload(token);
  if (!payload) return 0;
  if (typeof payload.exp !== "number") return Number.POSITIVE_INFINITY;

  return Math.max(payload.exp - Math.floor(Date.now() / 1000), 0);
}

export const isTokenExpired = (token: string) => getTokenSecondsRemaining(token) === 0;

export const isTokenExpiringSoon = (token: string, thresholdInSeconds = 60) =>
  getTokenSecondsRemaining(token) <= thresholdInSeconds;

function cookieOptions(maxAge?: number): CookieOptions {
  return {
    httpOnly: true,
    // Browsers treat localhost as secure, but plain-http previews would drop the cookie.
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  };
}

/**
 * Cookies to write after login, register or refresh. With "remember me" they
 * live until the token expires; otherwise they are session cookies that the
 * browser drops when it closes.
 */
export function getAuthCookieEntries(tokens: AuthTokens, rememberMe: boolean) {
  const maxAgeFor = (token: string) => {
    const seconds = getTokenSecondsRemaining(token);
    return rememberMe && Number.isFinite(seconds) ? seconds : undefined;
  };

  const entries: [name: string, value: string, options: CookieOptions][] = [
    [AUTH_COOKIES.accessToken, tokens.accessToken, cookieOptions(maxAgeFor(tokens.accessToken))],
  ];
  if (tokens.refreshToken) {
    entries.push([AUTH_COOKIES.refreshToken, tokens.refreshToken, cookieOptions(maxAgeFor(tokens.refreshToken))]);
  }
  if (rememberMe) {
    // Lives as long as the longest-lived token, so a refresh keeps the choice.
    const sessionToken = tokens.refreshToken ?? tokens.accessToken;
    entries.push([AUTH_COOKIES.rememberMe, "1", cookieOptions(maxAgeFor(sessionToken))]);
  }
  return entries;
}
