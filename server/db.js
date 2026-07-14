import mongoose from 'mongoose'

export default async function connectDB() {
  const uri = process.env.MONGO_URI

  if (!uri) {
    console.error('MongoDB connection failed: MONGO_URI is not set in environment')
    process.exit(1)
  }

  try {
    await mongoose.connect(uri)
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
    process.exit(1)
  }
}
