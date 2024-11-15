"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const FlightLog_1 = __importDefault(require("../models/FlightLog"));
const generateData = async () => {
    await mongoose_1.default.connect('mongodb://localhost:27017/flightLogs');
    const records = [];
    for (let i = 0; i < 10000; i++) {
        records.push({
            flightId: `FL${i}`,
            aircraftId: `AC${Math.floor(i / 100)}`,
            departureAirport: 'LAX',
            arrivalAirport: 'JFK',
            departureTime: new Date(),
            arrivalTime: new Date(),
            status: ['scheduled', 'departed', 'landed', 'canceled'][Math.floor(Math.random() * 4)],
            durationMinutes: Math.floor(Math.random() * 600),
        });
    }
    await FlightLog_1.default.insertMany(records);
    console.log('Data generated!');
    process.exit();
};
generateData();
//# sourceMappingURL=generateData.js.map