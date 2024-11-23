import jwt from 'jsonwebtoken'

import { JWT_KEY } from '../../config/config.js'
const TOKEN_EXPIRY = '15m'

export const jwtService = {
  generateTempToken (userId) {
    return jwt.sign(
      { userId, type: 'registration' },
      JWT_KEY,
      {
        expiresIn: TOKEN_EXPIRY
      }

    )
  },

  verifyToken (token) {
    try {
      return jwt.verify(token, JWT_KEY)
    } catch (err) {
      throw new Error('Invalid or expired Token')
    }
  }
}
