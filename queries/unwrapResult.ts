import type { ApiResult } from "@/types/api.types";

/** Server actions return a result object; TanStack Query needs a throw on failure. */
export async function unwrapResult<TData>(request: Promise<ApiResult<TData>>) {
  const result = await request;
  if (!result.success) throw new Error(result.message);
  return result.data;
}
