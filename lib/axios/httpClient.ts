import "server-only";

import axios, { type AxiosRequestConfig } from "axios";
import { cookies } from "next/headers";

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

// Runs on the Next.js server, which reads the browser's httpOnly cookies and
// forwards them; the backend reads the access token from the `accessToken` cookie.
async function authedClient() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  return createApiClient({
    headers: { Cookie: cookieHeader },
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
