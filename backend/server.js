import express from 'express'
import cookieParser from 'cookie-parser'

import { createServer } from 'http'

import { connectDB } from './utils/db.js'
import { corsMiddleware } from '../config/cors.js'
import { initSocket } from './socket.js'
import { cspMiddleware } from './middleware/cspMiddleware.js'

import authRouter from './routes/authRoutes.js'
import friendRouter from './routes/friendRoutes.js'
import settingRouter from './routes/settingRoutes.js'
import protectedUserRouter from './routes/protectedUser.js'
import chatRouter from './routes/messageRoutes.js'

import dotenv from 'dotenv'
dotenv.config()

const app = express()
const server = createServer(app)

app.use(cspMiddleware)
app.use(corsMiddleware)
app.use(cookieParser())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('frontend'))

initSocket(server)

app.use('/auth', authRouter)
app.use('/friends', friendRouter)
app.use('/chat', chatRouter)
app.use('/setting', settingRouter)
app.use('/protected', protectedUserRouter)

// const port = process.env.PORT || 3000
const port = 3000

try {
  await connectDB()
  server.listen(port, '0.0.0.0', () => {
    console.log(`server listening on port ${port}!`)
  })
} catch (err) {
  console.error('Failed to start server:', err)
  process.exit(1)
}
