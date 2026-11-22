import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('⚠️  MONGODB_URI not found in .env. Server will run in fallback mode.');
    return false;
  }

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected to MongoDB Atlas successfully');
    return true;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    return false;
  }
}
