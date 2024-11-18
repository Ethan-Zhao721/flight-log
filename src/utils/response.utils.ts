import { SuccessResponse, ErrorResponse } from '../types/response.types';

export const createSuccessResponse = <T>(data: T): SuccessResponse<T> => ({
  success: true,
  data,
  error: null
}); 

export const createErrorResponse = (message: string, code?: string): ErrorResponse => ({
  success: false,
  data: null,
  error: { message, code }
});
