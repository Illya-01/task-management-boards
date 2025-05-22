import mongoose from 'mongoose'

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || 'mongodb://localhost:27017/task-boards'

    await mongoose.connect(mongoURI)

    console.log('MongoDB Connected ✅')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}
