import jwt from 'jsonwebtoken'

import { JWT_KEY } from '../../config/config.js'

export class JwtService {
  static generateTempToken (userId) {
    return jwt.sign(
      { userId, type: 'registration' },
      JWT_KEY,
      { expiresIn: '15m' }
    )
  }

  static generateSessionToken (userId) {
    return jwt.sign(
      { userId, type: 'session' },
      JWT_KEY,
      { expiresIn: '24h' }
    )
  }

  static verifySessionToken (token) {
    try {
      const decoded = jwt.verify(token, JWT_KEY)
      if (decoded.type !== 'session') throw new Error('Invalid token type')
      return decoded
    } catch (err) {
      throw new Error('Invalid or expired session')
    }
  }

  static verifyToken (token) {
    try {
      const decoded = jwt.verify(token, JWT_KEY)
      if (decoded.type !== 'registration') throw new Error('Invalid token type')
      return decoded
    } catch (err) {
      throw new Error('Invalid or expired Token')
    }
  }
}
