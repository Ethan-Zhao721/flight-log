import { Response } from "express";
import { ERROR_MESSAGES, FLIGHT_STATUS } from "../../constant";
const aircraftIdPattern = /^AC\d{3}$/;
interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateQueryParams = (
  aircraftId: string,
  status: string,
  res: Response,
): ValidationResult => {
  if (!aircraftId) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.VALIDATION.REQUIRED_FIELDS + `: aircraftId`,
    };
  }
  if(!aircraftIdPattern.test(aircraftId)) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.VALIDATION.INVALID_ID,
    };
  }
  


  const allowedStatus: string[] = Object.values(FLIGHT_STATUS);
  if (status && !allowedStatus.includes(status)) {
    return { isValid: false, error: ERROR_MESSAGES.VALIDATION.INVALID_STATUS };
  }

  return {
    isValid: true,
  };
};
