import bcrypt from 'bcrypt'

import { PendingRegistration, ProfileImage, User } from '../models/sessionModel.js'
import { UserValidation } from '../utils/validation.js'
import { SALT_ROUNDS } from '../../config/config.js'
import { JwtService } from './jwtService.js'
import emailService from './emailService.js'

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

    await PendingRegistration.deleteMany({ email })

    const pendingUser = new PendingRegistration({
      email,
      password: hashedPassword
    })

    await pendingUser.save()

    return pendingUser
  },

  async registerUsername ({ pendingUserId, username, profileImageId }) {
    try {
      UserValidation.validateUsername(username)
    } catch (err) {
      throw new Error('Invalid credentials')
    }

    const existingUsername = await User.findOne({ username })
    if (existingUsername) throw new Error('Username already existing')

    const pendingUser = await PendingRegistration.findById(pendingUserId)
    if (!pendingUser) throw new Error('Registration session expired')

    const profileImage = await ProfileImage.findById(profileImageId)
    if (!profileImage) throw new Error('Profile image not found')

    const finalUser = new User({
      email: pendingUser.email,
      password: pendingUser.password,
      username,
      profileImage: profileImageId,
      isEmailVerified: false
    })

    await finalUser.save()
    await finalUser.populate('profileImage', 'name')

    try {
      await emailService.sendVerificationEmail(finalUser)
    } catch (emailError) {
      console.error('Error sending verification email:', emailError)
    }

    await PendingRegistration.findByIdAndDelete(pendingUserId)

    const userResponse = finalUser.toObject()
    delete userResponse.password

    return userResponse
  },

  async verifyEmail ({ token }) {
    const decoded = JwtService.verifyEmailToken(token)

    const user = await User.findById(decoded.userId)
    if (!user) throw new Error('User not found')

    if (user.isEmailVerified) throw new Error('Email already verified')

    const updateUser = await User.findByIdAndUpdate(
      decoded.userId,
      { isEmailVerified: true },
      { new: true, runValidators: false }
    )
    if (!updateUser) throw new Error('Error updating user')

    return { message: 'Email verified successfully' }
  },

  async login ({ username, email, password }) {
    const user = await User.findOne({
      $or: [{ username }, { email }]
    })
    if (!user) throw new Error('Invalid credentials')

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new Error('Invalid credentials')

    const userResponse = user.toObject()
    delete userResponse.password

    return userResponse
  },

  async verifiedEmail (userId) {
    try {
      const user = await User.findById(userId)
      if (!user) throw new Error('User not found')

      const isVerified = user.isEmailVerified
      return isVerified
    } catch (err) {
      throw new Error('Error verifying email')
    }
  }
}
