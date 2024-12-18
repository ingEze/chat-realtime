import jwt from 'jsonwebtoken'

import { JWT_KEY } from '../../config/config.js'

export class JwtService {
  static generateSessionToken (userId) {
    return jwt.sign(
      { userId, type: 'session' },
      JWT_KEY,
      { expiresIn: '24h' }
    )
  }

  static generateSecondInstanceToken (userId) {
    return jwt.sign(
      { userId, type: 'second_instance' },
      JWT_KEY,
      { expiresIn: '15m' }
    )
  }

  static verifySecondInstance (token) {
    try {
      const decoded = jwt.verify(token, JWT_KEY)
      if (decoded.type !== 'second_instance') throw new Error('Invalid token type')
      return decoded
    } catch (err) {
      console.error('verify second instance error:', err)
      throw new Error('Invalid or expired session register')
    }
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
}
