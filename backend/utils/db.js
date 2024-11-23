import mongoose from 'mongoose'
import { MONGO_URI } from '../../config/config.js'

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI)
    console.log('MongoDB connected', conn.connection.host)
  } catch (err) {
    console.error('Error connecting to MongoDB', err.message)
    process.removeListener(1)
  }
}

mongoose.connection.on('error', err => {
  console.log('MongoDB error:', err)
})

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected')
})
