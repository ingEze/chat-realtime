import { authService } from '../services/authService.js'

export class AuthController {
  static async register (req, res) {
    try {
      const { email, password } = req.body

      const result = await authService.register({ email, password })
      res.status(201).json({
        success: true,
        message: 'User registered, redireccion to ingres username',
        user: result
      })
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message
      })
    }
  }

  static async registerUsername (req, res) {
    try {
      const { username } = req.body
      const result = await authService.registerUsername({ username })

      res.status(201).json({
        success: true,
        message: 'User registered successful',
        user: result
      })
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message
      })
    }
  }

  static async login (req, res) {
    try {
      const { username, email, password } = req.body

      const result = await authService.login({ username, email, password })
      res.status(200).json({
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
