import { SuccessResponse } from '../types/response.types';

export const successResponse = <T>(data: T): SuccessResponse<T> => {
  return {
    success: true,
    data,
    error: null
  };
};
