import mongoose from 'mongoose'

let isConnected = false

export const connectDB = async (): Promise<void> => {
  if (isConnected) {
    console.log('MongoDB: Using existing connection')
    return
  }

  try {
    const uri = process.env.MONGODB_URI

    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables')
    }

    console.log('Connecting to MongoDB...')

    const conn = await mongoose.connect(uri)

    isConnected = true
    console.log(`MongoDB Connected: ${conn.connection.host}`)
    console.log(`Using database: ${conn.connection.db?.databaseName}`)
  } catch (error) {
    console.error('MongoDB connection error:', error)

    // In production, don't exit the process on error
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1)
    }
  }
}
