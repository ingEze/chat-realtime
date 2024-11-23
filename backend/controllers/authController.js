import { authService } from '../services/authService.js'
import { jwtService } from '../services/jwtService.js'
import { UserValidation } from '../utils/validation.js'
export class AuthController {
  static async register (req, res) {
    console.log('Register endpoint hit')
    console.log('Request body:', req.body)

    try {
      let { email, password } = req.body
      password = String(password)
      console.log('password after conversion: ', password, typeof password)

      if (!UserValidation.validatePassword(password)) {
        throw new Error(' The password must contain more than 8 characters')
      }

      const result = await authService.register({ email, password })
      console.log('Registration result:', result)

      const tempToken = jwtService.generateTempToken(result._id)
      console.log('Generate token: ', tempToken)

      res
        .cookie('temp_registration', tempToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 1000 * 60 * 60,
          sameSite: 'strict'
        })
        .status(201).json({
          success: true,
          message: 'User registered, redireccion to ingres username',
          user: result
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
      const { username } = req.body
      const tempToken = req.cookies.temp_registration

      if (!tempToken) {
        return res.status(401).json({
          success: false,
          message: 'Registration session expired'
        })
      }

      let decoded

      try {
        decoded = jwtService.verifyToken(tempToken)
      } catch (err) {
        return res.status(401).json({
          success: false,
          message: 'Invalide or expired registration session'
        })
      }

      if (decoded.type !== 'registration') {
        return res.status(401).json({
          success: false,
          message: 'Invalid registration session'
        })
      }

      const updateUser = await authService.registerUsername({
        userId: decoded.userId,
        username
      })

      res
        .clearCookie('temp_registration', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        })
        .status(200).json({
          success: true,
          message: 'Registration completed successfully',
          user: {
            username: updateUser.username,
            email: updateUser.email
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
      const { username, email, password } = req.body
      const result = await authService.login({ username, email, password })

      const sessionToken = jwtService.generateToken(result._id)

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
}
