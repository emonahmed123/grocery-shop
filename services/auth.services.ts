import "server-only";

import axios from "axios";

import { createApiClient, httpClient } from "@/lib/axios/httpClient";
import { AUTH_COOKIES } from "@/lib/tokenUtils";
import type { ApiResponse } from "@/types/api.types";
import type { AuthResponse, AuthTokens, AuthUser } from "@/types/auth.types";
import type {
  IForgotPasswordPayload,
  ILoginPayload,
  IRegisterPayload,
  IResetPasswordPayload,
} from "@/zod/auth.validation";

// Everything specific to the backend's auth contract lives in this file:
// endpoint paths and response shapes. Adapting to another backend means
// editing only here.
const AUTH_ENDPOINTS = {
  login: "/auth/login",
  register: "/auth/signup",
  me: "/auth/me",
  refreshToken: "/auth/refresh-token",
  logout: "/auth/logout",
  // Older backend deployments lack these two; the forms report that clearly.
  forgotPassword: "/auth/forget-password",
  resetPassword: "/auth/reset-password",
};

/** User as the backend sends it (MongoDB `_id`, and sometimes the password hash). */
export type BackendUser = {
  _id: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
};

type BackendLoginData = {
  accessToken: string;
  refreshToken?: string;
  data: BackendUser;
};

// Pick only safe fields, so the password hash never reaches the browser.
export const toAuthUser = (user: BackendUser): AuthUser => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  image: user.image ?? null,
});

type Credentials = Omit<ILoginPayload, "rememberMe">;
type NewAccount = Omit<IRegisterPayload, "rememberMe">;

export async function loginUser(payload: Credentials) {
  const response = await httpClient.post<BackendLoginData>(AUTH_ENDPOINTS.login, payload);
  const { accessToken, refreshToken, data: user } = response.data;
  const result: AuthResponse = { accessToken, refreshToken, user: toAuthUser(user) };
  return { message: response.message, data: result };
}

/** Creates the account; this backend returns the user but no tokens. */
export async function registerUser(payload: NewAccount) {
  const response = await httpClient.post<BackendUser>(AUTH_ENDPOINTS.register, payload);
  return { message: response.message, data: toAuthUser(response.data) };
}

export async function getMe() {
  const response = await httpClient.get<BackendUser>(AUTH_ENDPOINTS.me);
  return { message: response.message, data: toAuthUser(response.data) };
}

/**
 * Tells the backend the user logged out, so it clears the auth cookies it set
 * on its own domain. Best effort: older backends have no logout route, and the
 * store's own cookies are cleared either way.
 */
export async function logout() {
  try {
    await httpClient.post<null>(AUTH_ENDPOINTS.logout);
  } catch {
    // Nothing to undo: the tokens are stateless and expire on their own.
  }
}

/** Asks the backend to email a reset link to this address. */
export async function requestPasswordReset({ email }: IForgotPasswordPayload) {
  const response = await httpClient.post<null>(AUTH_ENDPOINTS.forgotPassword, { email });
  return { message: response.message };
}

/** Sets a new password using the token from the emailed link. */
export async function resetPassword({ token, password }: Pick<IResetPasswordPayload, "token" | "password">) {
  // The backend names the field `newPassword`.
  const response = await httpClient.post<null>(AUTH_ENDPOINTS.resetPassword, { token, newPassword: password });
  return { message: response.message };
}

/**
 * True when the backend has no such route at all (its catch-all 404 says
 * "API Not Found"), as opposed to a 404 the route itself returned.
 */
export const isMissingEndpoint = (error: unknown) =>
  axios.isAxiosError<{ message?: string }>(error) &&
  error.response?.status === 404 &&
  /api not found/i.test(error.response.data?.message ?? "");

export type RefreshResult =
  | { status: "refreshed"; tokens: AuthTokens }
  | { status: "rejected" }
  | { status: "error" };

/**
 * Called from the proxy, where `cookies()` is not available, so the refresh
 * token is sent explicitly. It only runs when a refresh token cookie exists,
 * which this backend does not issue yet; it is ready for when it does.
 * "rejected" means the session is over; "error" (network, 5xx) keeps the
 * cookies so a backend hiccup does not log users out.
 */
export async function refreshTokens(refreshToken: string): Promise<RefreshResult> {
  try {
    const response = await createApiClient({
      headers: { Cookie: `${AUTH_COOKIES.refreshToken}=${refreshToken}` },
    }).post<ApiResponse<Partial<AuthTokens>>>(AUTH_ENDPOINTS.refreshToken, { refreshToken });

    const { accessToken, refreshToken: newRefreshToken } = response.data.data;
    if (!accessToken) return { status: "error" };

    // Some backends do not rotate the refresh token; keep the old one then.
    return {
      status: "refreshed",
      tokens: { accessToken, refreshToken: newRefreshToken ?? refreshToken },
    };
  } catch (error) {
    const status = axios.isAxiosError(error) ? error.response?.status : undefined;
    return status === 400 || status === 401 || status === 403
      ? { status: "rejected" }
      : { status: "error" };
  }
}
