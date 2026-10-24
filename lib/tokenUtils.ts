import jwt, { type JwtPayload } from "jsonwebtoken";

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

/**
 * Checks the access token's signature and expiry with the backend's
 * `JWT_ACCESS_SECRET`. Returns the payload, or null when the token is expired,
 * forged or the secret is not set. Server only: the secret never reaches the browser.
 */
export function verifyAccessToken(token: string) {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) return null;

  try {
    const decoded = jwt.verify(token, secret);
    return typeof decoded === "string" ? null : (decoded as JwtPayload);
  } catch {
    return null;
  }
}

/** Reads a JWT's payload without verifying it; null when it is malformed. */
function decodeToken(token: string) {
  try {
    // jwt.decode throws on a payload that is not JSON, so a junk cookie must not crash the proxy.
    return jwt.decode(token, { json: true });
  } catch {
    return null;
  }
}

/** Seconds until the token's `exp`, read without checking the signature. */
export function getTokenSecondsRemaining(token: string) {
  const payload = decodeToken(token);
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
