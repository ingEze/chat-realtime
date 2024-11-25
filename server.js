import express from 'express'
import cookieParser from 'cookie-parser'

import { userRouter } from './routes/authRoutes.js'
import { PORT } from '../config/config.js'
import { connectDB } from './utils/db.js'
import { corsMiddleware } from '../config/cors.js'

const app = express()
app.use(cookieParser())

app.use(express.json())
app.use(corsMiddleware)
app.use(express.static('frontend'))

app.use('/api', userRouter)

try {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}!`)
  })
} catch (err) {
  console.error('Failed to start server:', err)
  process.exit(1)
}
