import { SettingService } from '../services/configService.js'

export class SettingController {
  static async updateUsername (req, res) {
    try {
      const { newUsername, password } = req.body
      const userId = req.user._id

      const user = await SettingService.updateUsername({
        userId,
        password,
        newUsername
      })

      res.status(200).json({
        success: true,
        message: 'Username updated successful',
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
}
