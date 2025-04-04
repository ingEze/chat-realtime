import dotenv from 'dotenv'
dotenv.config()

export const {
  SALT_ROUNDS = 10,
  MONGO_URI,
  JWT_SECRET: JWT_KEY,
  ACCESS_TOKEN_DROPBOX: DROPBOX_TOKEN
} = process.env
