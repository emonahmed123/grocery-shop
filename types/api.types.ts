export interface ApiResponse<TData> {
  success: true;
  message: string;
  data: TData;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}

export type ApiResult<TData> = ApiResponse<TData> | ApiErrorResponse;
