import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import boardRoutes from './routes/board.routes'
import cardRoutes from './routes/card.routes'
import { connectDB } from './config/db'
import { notFound, errorHandler } from './middleware/error.middleware'

dotenv.config()

connectDB()

const app = express()
const PORT = process.env.PORT || 5000

app.use(
  cors({
    origin: ['https://task-management-boards.vercel.app', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
)

app.use(express.json())

app.options('*', (req, res) => {
  res.status(200).end()
})

app.get('/', (req, res) => {
  res.send('API is running...')
  environment: process.env.NODE_ENV || 'development'
})

app.use('/api/boards', boardRoutes)
app.use('/api/cards', cardRoutes)

app.use(notFound)
app.use(errorHandler)

// Only listen when running locally, not in Vercel serverless environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}

// Add this for Vercel serverless deployment
connectDB().catch(console.error) // Initialize DB connection
export default app
