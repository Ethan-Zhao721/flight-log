import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './scripts/generateData';
import flightRoutes from './flightRoutes/flightRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use('/api/v1/flights', flightRoutes);


// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
