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

export const secondInstanceRegister = async (req, res, next) => {
  try {
    const secondInstanceToken = req.cookies.second_instance

    if (!secondInstanceToken) {
      return res.stauts(401).json({
        success: false,
        message: 'No registration token provided'
      })
    }

    const decoded = JwtService.verifySecondInstance(secondInstanceToken)
    req.temporaryRegistration = decoded
    next()
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired registration session'
    })
  }
}

export const routeProtected = async (req, res, next) => {
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

    console.log('user beign sent', user)

    return res.status(200).json({
      success: true,
      message: 'User authorized',
      user: {
        _id: user._id,
        username: user.username
      }
    })
  } catch (err) {
    console.error('routeProtected error:', err.message)
    return res.status(401).json({
      success: false,
      message: 'Invalid session'
    })
  }
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
