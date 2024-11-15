import express, { Request, Response, NextFunction } from 'express';
import FlightLog from '../models/FlightLog';

const router = express.Router();

// API 1: Retrieve Flight Logs with Pagination and Sorting
router.get(
    '/',
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { page = 1, limit = 10, sortField = 'departureTime', sortOrder = 'asc' } = req.query;
      // console.log(req.query);
      try {
        const flights = await FlightLog.find()
          .select('-_id -__v')
          .sort({ [sortField as string]: sortOrder === 'asc' ? 1 : -1 })
          .skip((+page - 1) * +limit)
          .limit(+limit);
        
        res.status(200).json(flights);
      } catch (error) {
        next(error); 
      }
    }
  );
  

//API 2: Query Flights by Aircraft and Status
router.get(
  '/aircraft/:aircraftId',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { aircraftId } = req.params;
    const { status } = req.query;

    try {
      const query: any = { aircraftId };
      if (status) query.status = status;

      const flights = await FlightLog.find(query);
      res.status(200).json(flights);
    } catch (error) {
      next(error);
    }
  }
);

// // API 3: Calculate Total Flight Hours Within a Date Range
router.get(
  '/total-hours',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({ error: 'Start and end dates are required' });
      return;
    }

    try {
      const totalHours = await FlightLog.aggregate([
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

      res.status(200).json({ totalHours: totalHours[0]?.totalHours || 0 }); // Send without return
    } catch (error) {
      next(error);
    }
  }
);

export default router;
