<<<<<<< HEAD
import dotenv from 'dotenv'
dotenv.config()

export const {
  PORT = 3000,
  SALT_ROUNDS = 10,
  MONGO_URI = 'mongodb://localhost:27017/flopiChat',
  JWT_SECRET: JWT_KEY
} = process.env
=======
import dotenv from 'dotenv'
dotenv.config()

export const {
  PORT = 3000,
  SALT_ROUNDS = 10,
  MONGO_URI = 'mongodb://localhost:27017/flopiChat',
  JWT_SECRET: JWT_KEY
} = process.env
>>>>>>> 48b0b8203183789199cab7330fa8974f93575e60
