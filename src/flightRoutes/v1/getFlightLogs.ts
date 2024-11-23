import { Request, Response, NextFunction } from "express";
import FlightLog from "../../models/FlightLog";
import { MONGODB, HttpStatus, ERROR_MESSAGES } from "../../constant";
import {
  createSuccessResponse,
  createErrorResponse,
} from "../../utils/response.utils";
import { validateQueryParams } from "../v1-validation/getFlightsLogsValidation";

// Retrieve Flight Logs with Pagination and Sorting

export const getFlightLogs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page =
      parseInt(req.query.page as string) || MONGODB.PAGINATION.DEFAULT_PAGE;
    const limit =
      parseInt(req.query.limit as string) || MONGODB.PAGINATION.DEFAULT_LIMIT;
    const sortField =
      (req.query.sortField as string) || MONGODB.PAGINATION.SORT_FIELD;
    const sortOrder =
      (req.query.sortOrder as string) || MONGODB.PAGINATION.SORT_ORDER;

    const validationResult = validateQueryParams(
      page,
      limit,
      sortField,
      sortOrder,
      res,
    );
    if (!validationResult.isValid) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          createErrorResponse(
            validationResult.error || ERROR_MESSAGES.VALIDATION.INVALID_REQUEST,
          ),
        );
    }

    const flights = await FlightLog.find()
      .select(MONGODB.FIELD_EXCLUSIONS.DEFAULT)
      .sort({
        [sortField as string]:
          sortOrder === "asc"
            ? MONGODB.SORT_ORDERS.ASC
            : MONGODB.SORT_ORDERS.DESC,
      })
      .skip((+page - 1) * +limit)
      .limit(+limit);
    const pagination = {
      page,
      limit,
      totalPages: Math.ceil(flights.length / limit),
      totalItems: flights.length,
    };
    res
      .status(HttpStatus.OK)
      .json(createSuccessResponse({ flights, pagination }));
  } catch (error) {
    next(
      createErrorResponse(
        (error as Error)?.message ||
        ERROR_MESSAGES.SERVER.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR.toString(),
      ),
    );
  }
};
