import express from "express";
import { getFlightLogs } from "./v1/getFlightLogs";
import { getFlightsByAircraft } from "./v1/getFlightsByAircraft";
import { getTotalHours } from "./v1/getTotalHours";

const router = express.Router();

const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// V1 Routes
// Default to v1
router.get("/", asyncHandler(getFlightLogs));
router.get("/flights/aircraft/:aircraftId", asyncHandler(getFlightsByAircraft));
router.get("/flights/total-hours", asyncHandler(getTotalHours));

router.get("/v1/flights", asyncHandler(getFlightLogs));
router.get(
  "/v1/flights/aircraft/:aircraftId",
  asyncHandler(getFlightsByAircraft),
);
router.get("/v1/flights/total-hours", asyncHandler(getTotalHours));

export default router;
