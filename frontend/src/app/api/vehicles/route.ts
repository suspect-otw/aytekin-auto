import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aytekin-auto';

// Vehicle Schema
const vehicleSchema = new mongoose.Schema({
  brand: String,
  model: String,
  year: String,
  km: String,
  color: String,
  price: String,
  imageUrl: String,
  link: String,
});

// Get the model, handling the case where it might already be compiled
const Vehicle = mongoose.models.Vehicle || mongoose.model('Vehicle', vehicleSchema);

// Connect to MongoDB
async function connectDB() {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI);
      console.log('Connected to MongoDB');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to MongoDB');
  }
}

export async function GET() {
  try {
    await connectDB();
    const vehicles = await Vehicle.find({});
    return NextResponse.json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vehicles' },
      { status: 500 }
    );
  }
}
