import express, { Request, Response, NextFunction } from 'express';
import FlightLog from '../models/FlightLog';
import { MONGODB } from '../constant';
import { createSuccessResponse, createErrorResponse } from '../utils/response.utils';
import { HttpStatus } from '../constant';
const router = express.Router();

// API 1: Retrieve Flight Logs with Pagination and Sorting
router.get(
    '/',
    async (req: Request, res: Response, next: NextFunction) => {
      const { 
        page = MONGODB.PAGINATION.DEFAULT_PAGE, 
        limit = MONGODB.PAGINATION.DEFAULT_LIMIT, 
        sortField = MONGODB.PAGINATION.SORT_FIELD, 
        sortOrder = MONGODB.PAGINATION.SORT_ORDER
      } = req.query;
      try {        
        const flights = await FlightLog.find()
          .select(MONGODB.FIELD_EXCLUSIONS.DEFAULT)
          .sort({ [sortField as string]: sortOrder === 'asc' 
            ? MONGODB.SORT_ORDERS.ASC
            : MONGODB.SORT_ORDERS.DESC            
          })
          .skip((+page - 1) * +limit)
          .limit(+limit);         
        res.status(HttpStatus.OK).json(createSuccessResponse(flights));
      } catch (error) {
        const errorResponse = createErrorResponse(
          (error as Error)?.message || 'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR.toString()
        );
        next(errorResponse); 
      }
    }
  );
  

//API 2: Query Flights by Aircraft and Status
router.get(
  '/aircraft/:aircraftId',
  async (req: Request, res: Response, next: NextFunction) => {
    const { aircraftId } = req.params;
    const { status } = req.query;

    try {
      const query: any = { aircraftId };
      if (status) query.status = status;
      const flights = await FlightLog.find(query);
      res.status(HttpStatus.OK).json(createSuccessResponse(flights));
    } catch (error) {
      const errorResponse = createErrorResponse(
        (error as Error)?.message || 'Internal Server Error',
      );
      next(errorResponse);
    }
  }
);

// API 3: Calculate Total Flight Hours Within a Date Range
router.get(
  '/total-hours',
  async (req: Request, res: Response, next: NextFunction) => {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {      
      const errorResponse = createErrorResponse(
        'Start and end dates are required',
      );
      res.status(HttpStatus.BAD_REQUEST).json(errorResponse);
      return;
    }

    try {
      let totalHours = await FlightLog.aggregate([
        {
          $match: {
            status: 'landed',
            arrivalTime: { $gte: new Date(startDate as string), $lte: new Date(endDate as string) },
          },
        },
        {
          $group: {
            _id: null,
            totalHours: { $sum: { $divide: ['$durationMinutes', 60] } },
          },
        },
      ]);
      totalHours = totalHours[0]?.totalHours || 0;
      res.status(HttpStatus.OK).json(createSuccessResponse(totalHours));
    } catch (error) {
      const errorResponse = createErrorResponse(
        (error as Error)?.message || 'Internal Server Error',
      );
      next(errorResponse);
    }
  }
);

export default router;
