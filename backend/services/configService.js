import bcrypt from 'bcrypt'
import { User } from '../models/sessionModel.js'
import { UserValidation } from '../utils/validation.js'

export class SettingService {
  static async updateUsername (userId, password, newUsername) {
    const user = await User.findById(userId)

    if (!user) throw new Error('User not found')

    const passwordCompare = await bcrypt.compare(password, user.password)
    if (!passwordCompare) throw new Error('Invalid credentials')

    UserValidation.validateUsername(user.username)
    await user.save()

    return user
  }
}
