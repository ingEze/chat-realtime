import bcrypt from 'bcrypt'
import { User } from '../models/sessionModel.js'
import { UserValidation } from '../utils/validation.js'
import { SALT_ROUNDS } from '../../config/config.js'
export class SettingService {
  static async updateUsername ({ userId, password, newUsername }) {
    const user = await User.findById(userId)
    if (!user) throw new Error('User not found')

    const passwordCompare = await bcrypt.compare(password, user.password)
    if (!passwordCompare) throw new Error('Password invalid')

    UserValidation.validateUsername(newUsername)

    const existingUser = await User.findOne({ username: newUsername })
    if (existingUser) {
      throw new Error('Username already existed')
    }

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

  static async updatePassword ({ userId, password, newPassword }) {
    try {
      console.log('Data recived:', { userId, newPassword, password })

      const user = await User.findById(userId)
      if (!user) {
        console.error('User not found')
        throw new Error('User not found')
      }
      const passwordCompare = await bcrypt.compare(password, user.password)
      if (!passwordCompare) {
        console.error('Password invalid')
        throw new Error('Password invalid')
      }

      try {
        UserValidation.validatePassword(newPassword)
      } catch (err) {
        console.error('Nueva contraseña invalida:', err)
        throw new Error('New password invalid')
      }

      const newPasswordHashed = await bcrypt.hash(newPassword, SALT_ROUNDS)
      user.password = newPasswordHashed

      await user.save()

      return user
    } catch (err) {
      throw new Error('Update password error', err)
    }
  }

  static async deleteAccount ({ userId, password }) {
    try {
      const user = await User.findById(userId)
      if (!user) throw new Error('User not found')

      const comparePassword = await bcrypt.compare(password, user.password)
      if (!comparePassword) throw new Error('Password invalid')

      await user.deleteOne()
      return { message: 'Account successfully deleted' }
    } catch (err) {
      console.error('Error completo en configService:')
      throw new Error(err.message || 'Error delete account')
    }
  }
}
