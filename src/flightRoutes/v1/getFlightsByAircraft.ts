import { Request, Response, NextFunction } from "express";
import FlightLog from "../../models/FlightLog";
import { HttpStatus, MONGODB, ERROR_MESSAGES} from "../../constant";
import {
  createSuccessResponse,
  createErrorResponse,
} from "../../utils/response.utils";
import { validateQueryParams } from "../v1-validation/getFlightsByAircraftValidation";

//Query Flights by Aircraft and Status
export const getFlightsByAircraft = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { aircraftId } = req.params;
  const { status } = req.query;

  const validationResult = validateQueryParams(
    aircraftId,
    status as string,
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

  try {
    const query: any = { aircraftId };
    if (status) query.status = status;
    const flights = await FlightLog.find(query)
      .select(MONGODB.FIELD_EXCLUSIONS.DEFAULT)
      .exec();
    res.status(HttpStatus.OK).json(createSuccessResponse(flights));
  } catch (error) {
    next(
      createErrorResponse(
        (error as Error)?.message ||
          ERROR_MESSAGES.SERVER.INTERNAL_SERVER_ERROR,
      ),
    );
  }
};
