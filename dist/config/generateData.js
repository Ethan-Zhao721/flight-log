"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const faker_1 = require("@faker-js/faker");
const dotenv_1 = __importDefault(require("dotenv"));
const FlightLog_1 = __importDefault(require("../models/FlightLog")); // Assuming you have the FlightLog model set up
// Load environment variables
dotenv_1.default.config();
// Database connection URI (can be stored in .env file)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/flightLogs';
// Connect to MongoDB
mongoose_1.default.connect(MONGO_URI)
    .then(() => {
    console.log('Connected to MongoDB');
    generateData(); // Call function to generate and insert data
})
    .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process if connection fails
});
// Function to generate random data and insert into the database
const generateData = async () => {
    const flightLogs = [];
    const numberOfRecords = 1;
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
        const departureTime = faker_1.faker.date.past({ years: 1 }); // Random date within the past year
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
        await FlightLog_1.default.insertMany(flightLogs);
        console.log(`${numberOfRecords} records successfully inserted into FlightLogs collection.`);
        process.exit(); // Exit after the data is generated
    }
    catch (error) {
        console.error('Error inserting data:', error);
        process.exit(1); // Exit in case of error
    }
};
const connectDB = async () => { };
exports.connectDB = connectDB;
//# sourceMappingURL=generateData.js.map