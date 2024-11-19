import request from 'supertest';
import { app } from '../app';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import FlightLog from '../models/FlightLog';
import { FLIGHT_STATUS } from '../constant';

describe('GET /api/v1/flights/aircraft/:aircraftId', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    try {
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      
      const isConnected = mongoose.connection.readyState === 1;
      if (!isConnected) {
        throw new Error('MongoDB not connected');
      }
    } catch (error) {
      console.error('Failed to connect to test database:', error);
      throw error;
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await FlightLog.deleteMany({});
  });

  const seedFlightLogs = async () => {
    await FlightLog.create([
      {
        aircraftId: 'AC001',
        flightId: 'FL001',
        status: FLIGHT_STATUS.LANDED,
        departureTime: new Date('2024-01-01T10:00:00Z'),
        arrivalTime: new Date('2024-01-01T12:00:00Z'),
        departureAirport: 'LAX',
        arrivalAirport: 'SFO',
        durationMinutes: 120
      },
      {
        aircraftId: 'AC001',
        flightId: 'FL002',
        status: FLIGHT_STATUS.LANDED,
        departureTime: new Date('2024-01-03T09:00:00Z'),
        arrivalTime: new Date('2024-01-04T11:00:00Z'),
        departureAirport: 'SFO',
        arrivalAirport: 'LAX',
        durationMinutes: 1560 
      },
    ]);
  };

  it('should return all flights for a specific aircraft', async () => {
    await seedFlightLogs();
    
    const response = await request(app)
      .get('/api/v1/flights/aircraft/AC001');

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.data[0]).toHaveProperty('aircraftId', 'AC001');
    expect(response.body.data[1]).toHaveProperty('aircraftId', 'AC001');
  });

  it('should return flights filtered by status', async () => {
    await FlightLog.create([
      {
        aircraftId: 'AC001',
        flightId: 'FL001',
        status: FLIGHT_STATUS.LANDED,
        departureTime: new Date('2024-01-01T10:00:00Z'),
        arrivalTime: new Date('2024-01-01T12:00:00Z'),
        departureAirport: 'LAX',
        arrivalAirport: 'SFO',
        durationMinutes: 120
      },
      {
        aircraftId: 'AC001',
        flightId: 'FL002',
        status: 'KKK',
        departureTime: new Date('2024-01-03T09:00:00Z'),
        arrivalTime: new Date('2024-01-04T11:00:00Z'),
        departureAirport: 'SFO',
        arrivalAirport: 'LAX',
        durationMinutes: 1560 
      },
    ]);
    
    const response = await request(app)
      .get('/api/v1/flights/aircraft/AC001')
      .query({ status: FLIGHT_STATUS.LANDED });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0]).toHaveProperty('status', FLIGHT_STATUS.LANDED);
  });

  it('should return empty array for non-existent aircraft', async () => {
    await seedFlightLogs();
    
    const response = await request(app)
      .get('/api/v1/flights/aircraft/AC002');

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(0);
  });

  it('should return 400 for invalid aircraft ID format', async () => {
    const response = await request(app)
      .get('/api/v1/flights/aircraft/12121');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 400 for invalid status value', async () => {
    const response = await request(app)
      .get('/api/v1/flights/aircraft/AC001')
      .query({ status: 'INVALID_STATUS' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should exclude sensitive fields in response', async () => {
    await seedFlightLogs();
    
    const response = await request(app)
      .get('/api/v1/flights/aircraft/AC001');

    expect(response.status).toBe(200);
    response.body.data.forEach((flight: any) => {
      expect(flight).not.toHaveProperty('__v');
    });
  });

  it('should handle multiple flights with same status', async () => {
    await FlightLog.create([
      {
        aircraftId: 'AC003',
        flightId: 'FL004',
        status: FLIGHT_STATUS.LANDED,
        departureTime: new Date('2024-01-01T10:00:00Z'),
        arrivalTime: new Date('2024-01-01T12:00:00Z'),
        departureAirport: 'LAX',
        arrivalAirport: 'SFO',
        durationMinutes: 120
      },
      {
        aircraftId: 'AC003',
        flightId: 'FL005',
        status: FLIGHT_STATUS.LANDED,
        departureTime: new Date('2024-01-02T10:00:00Z'),
        arrivalTime: new Date('2024-01-02T12:00:00Z'),
        departureAirport: 'SFO',
        arrivalAirport: 'LAX',
        durationMinutes: 120
      },
    ]);

    const response = await request(app)
      .get('/api/v1/flights/aircraft/AC003')
      .query({ status: FLIGHT_STATUS.LANDED });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
    response.body.data.forEach((flight: any) => {
      expect(flight.status).toBe(FLIGHT_STATUS.LANDED);
    });
  });
});