import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import { userRouter } from './routes/authRoutes.js'
import { PORT, configMongo } from '../config/config.js'

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(configMongo.dbUri, { useNewUrlParser: true, userUnifiedTopology: true })
    .then(() => console.log('Database connected'))
    .catch(error => console.error('Database connection error', error))
    
app.use('/api/auth', userRouter)

app.listen(PORT, () => console.log(`server listening on port ${PORT}!`))

/* 
"bcrypt": "^5.1.1",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.21.1",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.8.2",
*/