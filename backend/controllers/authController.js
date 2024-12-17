import { authService } from '../services/authService.js'
import { JwtService } from '../services/JwtService.js'
import { UserValidation } from '../utils/validation.js'

export class AuthController {
  static async register (req, res) {
    console.log('Register endpoint hit')
    console.log('Request body:', req.body)

    try {
      let { email, password } = req.body
      password = String(password)

      if (!UserValidation.validatePassword(password)) {
        throw new Error(' The password must contain more than 8 characters')
      }

      const result = await authService.register({ email, password })

      const tempToken = JwtService.generateTempToken(result._id)
      res
        .cookie('second_instance', tempToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 1000 * 60 * 60,
          sameSite: 'strict'
        })
        .status(201).json({
          success: true,
          message: 'User registered, redireccion to ingres username',
          userId: result._id,
          tempToken
        })
    } catch (err) {
      console.error('Registration error:', err.message)
      res.status(400).json({
        success: false,
        message: err.message
      })
    }
  }

  static async registerUsername (req, res) {
    try {
      const { username, profileImageId } = req.body
      const tempToken = req.cookies.second_instance

      if (!username) throw new Error('Username is required')

      if (!profileImageId) {
        return res.status(400).json({
          success: false,
          message: 'Imagen not valid'
        })
      }

      if (!tempToken) {
        return res.status(401).json({
          success: false,
          message: 'Registration session expired'
        })
      }

      let decoded

      try {
        decoded = JwtService.verifyToken(tempToken)
      } catch (err) {
        return res.status(401).json({
          success: false,
          message: 'Invalide or expired registration session'
        })
      }

      if (decoded.type !== 'second_instance') {
        return res.status(401).json({
          success: false,
          message: 'Invalid registration session'
        })
      }

      const user = await authService.registerUsername({
        userId: decoded.userId,
        username,
        profileImageId
      })

      await user.save()

      res
        .clearCookie('temp_registration', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        })
        .status(201).json({
          success: true,
          message: 'Registration completed successfully',
          user: {
            username: user.username,
            profileImage: user.profilePhoto
          }
        })
    } catch (err) {
      const statusCode = err.message.includes('not found') ? 401 : 400
      res.status(statusCode).json({
        success: false,
        message: err.message
      })
    }
  }

  static async login (req, res) {
    try {
      const { credentials, password } = req.body

      const loginField = credentials.includes('@')
        ? { email: credentials }
        : { username: credentials }

      const result = await authService.login({
        ...loginField,
        password
      })

      const sessionToken = JwtService.generateSessionToken(result._id)

      res
        .cookie('session', sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 24 * 60 * 60 * 1000,
          sameSite: 'strict'
        })
        .status(200).json({
          success: true,
          message: 'Login successful',
          user: result
        })
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message
      })
    }
  }

  static async userPhoto (req, res) {

  }
}
