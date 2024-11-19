import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
import FlightLog from "../models/FlightLog";
import { MAX_NUMBER_OF_RECORDS } from "../constant";
dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/flightLogs";

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");
    const existingCount = await FlightLog.countDocuments();
    if (existingCount === 0) {
      console.log("No existing data found. Generating new records...");
      await generateData();
    } else {
      console.log(
        `Found ${existingCount} existing records. Skipping data generation.`,
      );
      await mongoose.connection.close();
      process.exit(0);
    }
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    mongoose.connection.close();
    process.exit(1);
  });

const generateData = async () => {
  const flightLogs = [];
  const airports = [
    "LAX",
    "JFK",
    "ORD",
    "ATL",
    "SFO",
    "DFW",
    "MIA",
    "SEA",
    "BOS",
    "DEN",
  ];
  const aircrafts = [
    "AC001",
    "AC002",
    "AC003",
    "AC004",
    "AC005",
    "AC006",
    "AC007",
  ];
  let aircraftsLen = aircrafts.length;
  for (let i = 0; i < MAX_NUMBER_OF_RECORDS; i++) {
    const flightId = `FL${i + 1}`;
    const aircraftId = aircrafts[Math.floor(Math.random() * aircraftsLen)];
    const departureAirport = airports[Math.floor(Math.random() * aircraftsLen)];
    const arrivalAirport = airports[Math.floor(Math.random() * aircraftsLen)];
    const status = ["scheduled", "departed", "landed", "canceled"][
      Math.floor(Math.random() * 4)
    ];

    // Random flight duration between 60 minutes and 600 minutes
    const durationMinutes = Math.floor(Math.random() * 540) + 60;
    const departureTime = faker.date.past({ years: 1 });
    const arrivalTime = new Date(departureTime);
    arrivalTime.setMinutes(arrivalTime.getMinutes() + durationMinutes);

    flightLogs.push({
      flightId,
      aircraftId,
      departureAirport,
      arrivalAirport,
      departureTime,
      arrivalTime,
      status,
      durationMinutes,
    });
  }

  try {
    await FlightLog.insertMany(flightLogs);
    console.log(
      `${MAX_NUMBER_OF_RECORDS} records successfully inserted into FlightLogs collection.`,
    );
    process.exit();
  } catch (error) {
    console.error("Error inserting data:", error);
    process.exit(1);
  }
};

export const connectDB = async () => {};
