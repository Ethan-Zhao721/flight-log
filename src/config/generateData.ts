import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import FlightLog from '../models/FlightLog';  // Assuming you have the FlightLog model set up

// Load environment variables
dotenv.config();

// Database connection URI (can be stored in .env file)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/flightLogs';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    //generateData();  // Call function to generate and insert data
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process if connection fails
  });

// Function to generate random data and insert into the database
const generateData = async () => {
  const flightLogs = [];
  const numberOfRecords = 10;

  // List of departure and arrival airports for diversity
  const airports = ['LAX', 'JFK', 'ORD', 'ATL', 'SFO', 'DFW', 'MIA', 'SEA', 'BOS', 'DEN'];
  const aircrafts = ['AC123', 'AC456', 'AC789', 'AC101', 'AC112', 'AC202', 'AC303'];

  for (let i = 0; i < numberOfRecords; i++) {
    const flightId = `FL${i + 1}`;
    const aircraftId = aircrafts[Math.floor(Math.random() * aircrafts.length)];
    const departureAirport = airports[Math.floor(Math.random() * airports.length)];
    const arrivalAirport = airports[Math.floor(Math.random() * airports.length)];
    const status = ['scheduled', 'departed', 'landed', 'canceled'][Math.floor(Math.random() * 4)];

    // Random flight duration between 60 minutes and 600 minutes (1 hour to 10 hours)
    const durationMinutes = Math.floor(Math.random() * 540) + 60;

    // Random timestamps for departure and arrival (within the last year)
    const departureTime = faker.date.past({ years: 1 });  // Random date within the past year
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
      durationMinutes
    });
  }

  try {
    // Insert the generated data into MongoDB
    await FlightLog.insertMany(flightLogs);
    console.log(`${numberOfRecords} records successfully inserted into FlightLogs collection.`);
    process.exit();  // Exit after the data is generated
  } catch (error) {
    console.error('Error inserting data:', error);
    process.exit(1);  // Exit in case of error
  }
};

export const connectDB = async () => {};
