import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/generateData';
import flightRoutes from './routes/flightRoutes';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB(); // Call the function to connect to the database

// Use routes
app.use('/api/v1/flights', flightRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
