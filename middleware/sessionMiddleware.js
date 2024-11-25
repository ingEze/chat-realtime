import { JwtService } from './sessionMiddleware.js'
import { User } from '../models/sessionModel.js'

export class authMiddleware {
  static async authSession (req, res, next) {
    const sessionToken = req.cookies.session

    if (!sessionToken) {
      return res.status(401).json({
        success: false,
        message: 'No session token'
      })
    }

    try {
      const decoded = JwtService.verifySessionToken(sessionToken)

      const user = await User.findById(decoded.userId).select('-password')
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        })
      }

      req.user = user
      next()
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session'
      })
    }
  }

  static async isAdmin (req, res, next) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado'
      })
    }
    next()
  }
}
