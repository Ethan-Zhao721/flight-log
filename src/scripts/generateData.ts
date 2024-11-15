import mongoose from 'mongoose';
import FlightLog from '../models/FlightLog';

const generateData = async () => {
  await mongoose.connect('mongodb://localhost:27017/flightLogs');

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

  await FlightLog.insertMany(records);
  console.log('Data generated!');
  process.exit();
};

generateData();
