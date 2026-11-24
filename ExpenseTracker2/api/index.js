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

// Diagnostic Health check endpoint
const healthHandler = (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  const hasUri = Boolean(process.env.MONGODB_URI);
  res.json({
    status: 'ok',
    database: isConnected ? 'connected' : 'disconnected',
    mongoReadyState: mongoose.connection.readyState,
    hasMongoUri: hasUri,
    message: isConnected
      ? 'MongoDB Atlas is connected and ready'
      : !hasUri
      ? 'MONGODB_URI environment variable is missing on Vercel'
      : 'Connecting or unable to reach MongoDB cluster (Check Atlas Network IP whitelist 0.0.0.0/0)',
  });
};

app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

// Mount finance routes (support both with and without /api prefix)
app.use('/api/finance', financeRoutes);
app.use('/finance', financeRoutes);

export default app;
