import bcrypt from 'bcrypt'

import { User } from '../models/sessionModel.js'
import { UserValidation } from '../utils/validation.js'
import { SALT_ROUNDS } from '../../config/config.js'

export const authService = async (username, email, password) => {
  if (!UserValidation.validateUsername(username)) throw new Error('Username not invalid')
  if (!UserValidation.validateEmail(email)) throw new Error('Invalid gmail')
  if (!UserValidation.validatePassword(password)) throw new Error('The password must contain more than 8 characters.')

  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  })

  if (existingUser) throw new Error('The user already existed')

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

  const user = new User({
    username,
    email,
    password: hashedPassword
  })

  await user.save()

  const userResponse = user.toObject()
  delete userResponse.password

  return userResponse
}
