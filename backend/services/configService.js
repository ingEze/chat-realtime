import bcrypt from 'bcrypt'
import { User } from '../models/sessionModel.js'
import { UserValidation } from '../utils/validation.js'

export class SettingService {
  static async updateUsername ({ userId, password, newUsername }) {
    const user = await User.findById(userId)
    if (!user) throw new Error('User not found')

    const passwordCompare = await bcrypt.compare(password, user.password)
    if (!passwordCompare) throw new Error('Password invalid')

    UserValidation.validateUsername(newUsername)

    const existingUser = await User.findOne({ username: newUsername })
    if (existingUser) throw new Error('Username already existed')

    user.username = newUsername

    await user.save()

    return user
  }

  static async updateEmail ({ userId, password, newEmail }) {
    const user = await User.findById(userId)
    if (!user) throw new Error('User not found')

    const passwordCompare = await bcrypt.compare(password, user.password)
    if (!passwordCompare) throw new Error('Password invalid')

    UserValidation.validateEmail(newEmail)

    const existingNewEmail = await User.findOne({ email: newEmail })
    if (existingNewEmail) throw new Error('Email already existed')

    user.email = newEmail

    await user.save()

    return user
  }
}
