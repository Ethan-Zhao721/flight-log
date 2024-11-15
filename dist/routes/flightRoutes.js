"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const FlightLog_1 = __importDefault(require("../models/FlightLog"));
const router = express_1.default.Router();
// API 1: Retrieve Flight Logs with Pagination and Sorting
router.get('/', async (req, res, next) => {
    const { page = 1, limit = 10, sortField = 'departureTime', sortOrder = 'asc' } = req.query;
    try {
        const flights = await FlightLog_1.default.find()
            .sort({ [sortField]: sortOrder === 'asc' ? 1 : -1 })
            .skip((+page - 1) * +limit)
            .limit(+limit);
        res.status(200).json(flights); // Send response without returning
    }
    catch (error) {
        next(error); // Forward error to error-handling middleware
    }
});
//API 2: Query Flights by Aircraft and Status
router.get('/aircraft/:aircraftId', async (req, res, next) => {
    const { aircraftId } = req.params;
    const { status } = req.query;
    try {
        const query = { aircraftId };
        if (status)
            query.status = status;
        const flights = await FlightLog_1.default.find(query);
        res.status(200).json(flights); // Send response without returning
    }
    catch (error) {
        next(error); // Forward error to error-handling middleware
    }
});
// // API 3: Calculate Total Flight Hours Within a Date Range
router.get('/total-hours', async (req, res, next) => {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
        res.status(400).json({ error: 'Start and end dates are required' });
        return;
    }
    try {
        const totalHours = await FlightLog_1.default.aggregate([
            {
                $match: {
                    status: 'landed',
                    arrivalTime: { $gte: new Date(startDate), $lte: new Date(endDate) },
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
    }
    catch (error) {
        next(error); // Forward error to error-handling middleware
    }
});
exports.default = router;
//# sourceMappingURL=flightRoutes.js.map