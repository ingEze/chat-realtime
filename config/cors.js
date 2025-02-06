import cors from 'cors'

export const ACCEPTED_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:3000',
  'http://localhost:3055',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'https://www.dropboxusercontent.com',
  'https://cdn.socket.io',
  process.env.FRONTEND_URL,
  'https://flopichat.up.railway.app',
  'https://1d44-2800-810-5bb-16d-492b-df5e-53e8-46fa.ngrok-free.app'
]

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin || ACCEPTED_ORIGINS.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Cookie',
    'Set-Cookie'
  ],
  optionsSuccessStatus: 204
})
