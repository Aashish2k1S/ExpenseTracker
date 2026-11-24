import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../server/db.js';
import financeRoutes from '../server/routes/financeRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Middleware to ensure DB connection is ready for serverless requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Database connection error in serverless:', err);
  }
  next();
});

// Health check endpoint (support both with and without /api prefix)
const healthHandler = (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.json({
    status: 'ok',
    database: isConnected ? 'connected' : 'disconnected',
    mongoReadyState: mongoose.connection.readyState,
  });
};

app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

// Mount finance routes (support both with and without /api prefix)
app.use('/api/finance', financeRoutes);
app.use('/finance', financeRoutes);

export default app;
