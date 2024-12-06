import express from 'express'
import cookieParser from 'cookie-parser'

import { PORT } from '../config/config.js'
import { connectDB } from './utils/db.js'
import { corsMiddleware } from '../config/cors.js'

import authRouter from './routes/authRoutes.js'
import friendRouter from './routes/friendRoutes.js'
import settingRouter from './routes/settingRoutes.js'

const app = express()
app.use(cookieParser())

app.use(express.json())
app.use(corsMiddleware)
app.use(express.static('frontend'))

app.use('/auth', authRouter)
app.use('/friends', friendRouter)
app.use('/setting', settingRouter)

try {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}!`)
  })
} catch (err) {
  console.error('Failed to start server:', err)
  process.exit(1)
}
