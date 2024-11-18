export interface BaseResponse {
    success: boolean;
    error: object | null;
  }
  
  export interface SuccessResponse<T> extends BaseResponse {
    success: true;
    data: T;
    error: null;
  }
  
  export interface ErrorResponse extends BaseResponse {
    success: false;
    data: null;
    error: {
      message: string;
      code?: string;
    };
  }
  
  export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;