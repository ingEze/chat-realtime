<<<<<<< HEAD
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
=======
import express from 'express'
import cors from 'cors'

import { userRouter } from './routes/authRoutes.js'
import { PORT } from '../config/config.js'
import { connectDB } from './utils/db.js'

const app = express()

app.use(cors())
app.use(express.json())

connectDB()

app.use('/api/auth', userRouter)

app.listen(PORT, () => console.log(`server listening on port ${PORT}!`))
>>>>>>> 48b0b8203183789199cab7330fa8974f93575e60
