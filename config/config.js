import dotenv from 'dotenv'
dotenv.config()

export const {
  PORT = 3000,
  SALT_ROUNDS = 10,
  MONGO_URI = 'mongodb://localhost:27017/flopiChat'
} = process.env
