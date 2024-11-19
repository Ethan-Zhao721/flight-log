import { Response } from "express";
import { ERROR_MESSAGES } from "../../constant";

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateQueryParams = (
  startDate: string,
  endDate: string,
  res: Response,
): ValidationResult => {
  if (!startDate || !endDate) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.VALIDATION.REQUIRED_FIELDS + `: startDate, endDate`,
    };
  }

  return {
    isValid: true,
  };
};
