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
