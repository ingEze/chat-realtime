// sessionMiddleware.js

import { JwtService } from '../services/JwtService.js'
import { User } from '../models/sessionModel.js'

export const authSession = async (req, res, next) => {
  const sessionToken = req.cookies.session

  if (!sessionToken) {
    return res.status(401).json({
      success: false,
      message: 'No session token'
    })
  }

  try {
    const decoded = JwtService.verifySessionToken(sessionToken)

    const user = await User.findById(decoded.userId)
      .select('-password -__v')
      .lean()
    if (!user) {
      return res.status(404).json({
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

export const routeProtected = async (req, res, next) => {
  const sessionToken = req.cookies.session

  const decoded = JwtService.verifySessionToken(sessionToken)

  if (!decoded) {
    res.status(401).json({
      success: false,
      message: 'User not authorized'
    })
  }
  next()
}

export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado'
    })
  }
  next()
}
