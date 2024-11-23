import mongoose from 'mongoose'
import { MONGO_URI } from '../../config/config'

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('MongoDB connected', conn.connection.host)
  } catch (err) {
    console.error('Error connecting to MongoDB', err.message)
    process.removeListener(1)
  }
}
