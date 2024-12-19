import { SettingService } from '../services/settingService.js'
export class SettingController {
  static async updateUsername (req, res) {
    try {
      const { newUsername, password } = req.body
      if (!req.user) {
        return res.status(401).json({ message: 'User not authorized' })
      }
      const userId = req.user._id

      const user = await SettingService.updateUsername({
        userId,
        password,
        newUsername
      })

      res.status(200).json({
        success: true,
        message: 'Username updated successful',
        redirectUrl: '/index.html',
        user: { username: user.username }
      })
    } catch (err) {
      let statusCode = 401
      let errorMessage = 'Error updating username'

      switch (err.message) {
        case 'Password invalid':
          statusCode = 400
          errorMessage = 'Password invalid'
          break
        case 'Username invalid':
          statusCode = 400
          errorMessage = 'Username invalid'
          break
        case 'Username already existed':
          statusCode = 400
          errorMessage = 'Username already existed'
          break
      }
      res.status(statusCode).json({
        success: false,
        message: errorMessage
      })
    }
  }

  static async updateEmail (req, res) {
    try {
      const { newEmail, password } = req.body
      const userId = req.user._id

      const user = await SettingService.updateEmail({
        userId,
        password,
        newEmail
      })

      res.status(200).json({
        success: true,
        message: 'Update email successful',
        redirectUrl: '/index.html',
        user: { email: user.email }
      })
    } catch (err) {
      let statusCode = 401
      let errorMessage = 'Error updating email'

      switch (err.message) {
        case 'Password invalid':
          statusCode = 400
          errorMessage = 'Password invalid'
          break
        case 'Email invalid':
          statusCode = 400
          errorMessage = 'Username invalid'
          break
        case 'Email already existed':
          statusCode = 400
          errorMessage = 'Username already existed'
          break
      }
      res.status(statusCode).json({
        success: false,
        message: errorMessage
      })
    }
  }

  static async updatePassword (req, res) {
    try {
      const { newPassword, password } = req.body

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not authorized'
        })
      }

      const userId = req.user._id

      console.log('Datos recibidos en controlador:', {
        userId,
        newPassword: newPassword ? 'provided' : 'not provided',
        passwordProvided: !!password
      })

      const user = await SettingService.updatePassword({
        userId,
        newPassword,
        password
      })

      res.status(200).json({
        success: true,
        message: 'Updated password successful',
        redirectUrl: '/index.html',
        user: { password: user.password }
      })
    } catch (err) {
      console.error('Error completo en updatePassword(controller):', err)

      let statusCode = 500
      let errorMessage = 'Error updating password'

      switch (err.message) {
        case 'Password invalid':
          statusCode = 400
          errorMessage = 'Password invalid'
          break
        case 'New password invalid':
          statusCode = 400
          errorMessage = 'New password invalid'
          break
        default:
          statusCode = 500
          errorMessage = 'Error updated password'
      }
      res.status(statusCode).json({
        success: false,
        message: errorMessage
      })
    }
  }

  static async deleteAccount (req, res) {
    console.log('req.body:', req.body)
    try {
      const { password } = req.body

      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authorized'
        })
      }

      const userId = req.user._id

      const userDelete = await SettingService.deleteAccount({ userId, password })

      res.status(200).json({
        success: true,
        message: 'Delete account successful',
        redirectUrl: '/login.html',
        user: userDelete
      })
    } catch (err) {
      let statusCode = 500
      let errorMessage = 'Error updating password'

      switch (err.message) {
        case 'Password invalid':
          statusCode = 400
          errorMessage = 'Password invalid'
          break
        default:
          statusCode = 500
          errorMessage = 'Error delete account'

          res.status(statusCode).json({
            success: false,
            message: errorMessage
          })
      }
    }
  }

  static async updateProfileImage (req, res) {
    try {
      const { profileImageId } = req.body
      const userId = req.user._id

      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authorized'
        })
      }

      if (!userId) {
        res.status(404).json({
          success: false,
          mesagge: 'User not found'
        })
      }

      const user = await SettingService.updateProfileImage({
        userId,
        profileImageId
      })

      res.status(200).json({
        success: true,
        message: 'Image updated',
        user: { profileImage: user.profileImage }
      })
    } catch (err) {
      console.error('Error in controller:', err.message)
      console.error('Error controller:', err)
      res.status(500).json({
        success: false,
        message: 'Error updated image'
      })
    }
  }
}
