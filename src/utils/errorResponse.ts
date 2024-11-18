import { ErrorResponse } from '../types/response.types';

export const errorResponse = (message: string, code?: string): ErrorResponse => ({
  success: false,
  data: null,
  error: {
    message,
    code
  }
});
