/** Paging info the backend sends with list endpoints. */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface ApiResponse<TData> {
  success: true;
  message: string;
  data: TData;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}

export type ApiResult<TData> = ApiResponse<TData> | ApiErrorResponse;

/** One page of a list plus its paging info. */
export interface Paginated<TData> {
  data: TData[];
  meta: PaginationMeta;
}
