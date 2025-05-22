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

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('API is running...')
})

app.use('/api/boards', boardRoutes)
app.use('/api/cards', cardRoutes)

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
