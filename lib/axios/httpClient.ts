import "server-only";

import axios, { type AxiosRequestConfig } from "axios";
import { cookies } from "next/headers";

import { AUTH_COOKIES } from "@/lib/tokenUtils";
import type { ApiResponse } from "@/types/api.types";

/** Base axios instance for the backend. Safe to use where `cookies()` is unavailable (proxy). */
export function createApiClient(config?: AxiosRequestConfig) {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    throw new Error("BACKEND_URL is not defined in environment variables");
  }

  return axios.create({
    // Every route on this backend lives under `/api`.
    baseURL: `${backendUrl.replace(/\/$/, "")}/api`,
    timeout: 30_000,
    ...config,
    headers: { "Content-Type": "application/json", ...config?.headers },
  });
}

// Runs on the Next.js server, which reads the browser's httpOnly cookie and
// sends the token the way the backend expects: `Authorization: Bearer <token>`.
async function authedClient() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_COOKIES.accessToken)?.value;

  return createApiClient({
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
  });
}

type RequestOptions = Pick<AxiosRequestConfig, "params" | "headers">;

async function httpGet<TData>(endpoint: string, options?: RequestOptions) {
  const client = await authedClient();
  const response = await client.get<ApiResponse<TData>>(endpoint, options);
  return response.data;
}

async function httpPost<TData>(endpoint: string, data?: unknown, options?: RequestOptions) {
  const client = await authedClient();
  const response = await client.post<ApiResponse<TData>>(endpoint, data, options);
  return response.data;
}

async function httpPut<TData>(endpoint: string, data?: unknown, options?: RequestOptions) {
  const client = await authedClient();
  const response = await client.put<ApiResponse<TData>>(endpoint, data, options);
  return response.data;
}

async function httpPatch<TData>(endpoint: string, data?: unknown, options?: RequestOptions) {
  const client = await authedClient();
  const response = await client.patch<ApiResponse<TData>>(endpoint, data, options);
  return response.data;
}

async function httpDelete<TData>(endpoint: string, options?: RequestOptions) {
  const client = await authedClient();
  const response = await client.delete<ApiResponse<TData>>(endpoint, options);
  return response.data;
}

export const httpClient = {
  get: httpGet,
  post: httpPost,
  put: httpPut,
  patch: httpPatch,
  delete: httpDelete,
};

type BackendError = {
  message?: string;
  errorSources?: { path: string; message: string }[];
};

/**
 * Prefers the backend's specific `errorSources` message (the top-level one is
 * often generic, like "Duplicate Error"), then axios' own, so the UI shows
 * something useful.
 */
export function getApiErrorMessage(error: unknown, fallback = "Something went wrong") {
  if (axios.isAxiosError<BackendError>(error)) {
    const data = error.response?.data;
    const detail = data?.errorSources?.[0]?.message || data?.message;
    if (detail) return detail;
    if (!error.response) return "Cannot reach the server, please try again";
    return error.message || fallback;
  }
  return error instanceof Error ? error.message : fallback;
}
