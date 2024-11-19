import { Request, Response, NextFunction } from "express";
import FlightLog from "../../models/FlightLog";
import { HttpStatus } from "../../constant";
import {
  createSuccessResponse,
  createErrorResponse,
} from "../../utils/response.utils";
import { FLIGHT_STATUS, ERROR_MESSAGES } from "../../constant";
import { validateQueryParams } from "../v1-validation/getTotalHoursValidation";

//  Calculate Total Flight Hours Within a Date Range
export const getTotalHours = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { startDate, endDate } = req.query;
    const validationResult = validateQueryParams(
      startDate as string,
      endDate as string,
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

    let totalHours = await FlightLog.aggregate([

      {
        $match: {
          status: FLIGHT_STATUS.LANDED, //status set to “landed”
          arrivalTime: { $gte: new Date(startDate as string), $lte: new Date(endDate as string) },
        },
      },
      {
        $project: {
          flightId: 1,
          durationHours: {
            $divide: [
              { $subtract: ["$arrivalTime", "$departureTime"] },
              3600000  // Convert ms to hours directly
            ]
          },
        },
      },
      {
        $group: {
          _id: null,
          totalHours: { $sum: '$durationHours' },
        },
      }
    ]);
    totalHours = totalHours[0]?.totalHours || 0;
    res.status(HttpStatus.OK).json(createSuccessResponse({ "totalHours:": totalHours }));
  } catch (error) {
    next(
      createErrorResponse(
        (error as Error)?.message ||
        ERROR_MESSAGES.SERVER.INTERNAL_SERVER_ERROR,
      ),
    );
  }
};
