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
      res.status(401).json({
        success: false,
        message: err.message || 'Error updating username'
      })
    }
  }
}
