<<<<<<< HEAD
import bcrypt from 'bcrypt'

import { User } from '../models/sessionModel.js'
import { UserValidation } from '../utils/validation.js'
import { SALT_ROUNDS } from '../../config/config.js'

export const authService = {
  async register ({ email, password }) {
    if (!UserValidation.validateEmail(email)) throw new Error('Invalid gmail')
    if (!UserValidation.validatePassword(password)) throw new Error('Invalid password')

    const existingUser = await User.findOne({ email })
    if (existingUser) throw new Error('The user already existed')

    const passwordString = String(password)
    if (typeof passwordString !== 'string') throw new Error('Password must be a string')

    const saltRounds = parseInt(SALT_ROUNDS, 10)
    const salt = await bcrypt.genSalt(saltRounds)

    const hashedPassword = await bcrypt.hash(passwordString, salt)

    const tempUser = new User({
      email,
      password: hashedPassword,
      username: null
    })

    await tempUser.save()

    const userResponse = tempUser.toObject()
    delete userResponse.password

    return tempUser
  },

  async registerUsername ({ userId, username }) {
    try {
      UserValidation.validateUsername(username)
    } catch (err) {
      throw new Error('Invalid credentials')
    }
    const existingUsername = await User.findOne({ username })
    if (existingUsername) throw new Error('Username already existing')

    const updateUser = await User.findByIdAndUpdate(
      userId,
      { username },
      { new: true, runValidators: true }
    )

    if (!updateUser) throw new Error('User not found')

    const userResponse = updateUser.toObject()
    delete userResponse.password

    return userResponse
  },

  async login ({ username, email, password }) {
    const user = await User.findOne({
      $or: [{ username }, { email }]
    })
    console.log('login.authService: ', user)
    if (!user) throw new Error('Invalid credentials')

    const isMatch = await bcrypt.compare(password, user.password)
    console.log('userServive.login: ', isMatch)
    if (!isMatch) throw new Error('Invalid credentials')

    const userResponse = user.toObject()
    delete userResponse.password

    return userResponse
  }
}
=======
import bcrypt from 'bcrypt'

import { User } from '../models/sessionModel.js'
import { UserValidation } from '../utils/validation.js'
import { SALT_ROUNDS } from '../../config/config.js'

export const authService = {
  async register ({ username, email, password }) {
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
  },
  async login ({ username, email, password }) {
    const user = await User.findOne({ username, email })
    if (!user) throw new Error('Invalid username or password')

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new Error('Invalid username or password')

    return user
  }
}
>>>>>>> 48b0b8203183789199cab7330fa8974f93575e60
