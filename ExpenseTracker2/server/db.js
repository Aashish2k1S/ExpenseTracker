import mongoose from 'mongoose';

// Cache connection in global scope for serverless environments (Vercel)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('⚠️  MONGODB_URI not found in environment. Server will run in fallback mode.');
    return false;
  }

  // If already connected, reuse existing connection
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    mongoose.set('strictQuery', false);
    cached.promise = mongoose
      .connect(uri, {
        serverSelectionTimeoutMS: 5000,
      })
      .then((m) => {
        console.log('✅ Connected to MongoDB Atlas successfully');
        return m;
      })
      .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err.message);
        cached.promise = null;
        return null;
      });
  }

  cached.conn = await cached.promise;
  return Boolean(cached.conn);
}
