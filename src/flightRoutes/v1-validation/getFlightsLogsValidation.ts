import { Response } from "express";
import { ERROR_MESSAGES, ALLOWED_SORT_FIELDS } from "../../constant";

interface ValidationResult {
  isValid: boolean;
  error?: string;
  data?: {
    page: number;
    limit: number;
    sortField: string;
    sortOrder: string;
  };
}

export const validateQueryParams = (
  page: number,
  limit: number,
  sortField: string,
  sortOrder: string,
  res: Response,
): ValidationResult => {
  if (page < 1) {
    return { isValid: false, error: ERROR_MESSAGES.PAGINATION.INVALID_PAGE };
  }

  if (limit < 1 || limit > 100) {
    return { isValid: false, error: ERROR_MESSAGES.PAGINATION.INVALID_LIMIT };
  }

  const allowedSortFields: string[] = Object.values(ALLOWED_SORT_FIELDS);
  if (!allowedSortFields.includes(sortField)) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.PAGINATION.INVALID_SORT_FIELD,
    };
  }

  if (!["asc", "desc"].includes(sortOrder.toLowerCase())) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.PAGINATION.INVALID_SORT_ORDER,
    };
  }

  return {
    isValid: true,
    data: { page, limit, sortField, sortOrder },
  };
};
