import mongoose from 'mongoose'

export const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGODB_URI || ''

    console.log('Connecting to MongoDB...')

    const conn = await mongoose.connect(uri)

    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}
