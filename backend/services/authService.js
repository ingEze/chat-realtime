import bcrypt from 'bcrypt'

import { User } from '../models/userModel.js'
import { validateUsername, validateEmail, validatePassword } from '../utils/validation.js'
import { SALT_ROUNDS } from '../../config/config.js'

export const registerUser = async (username, email, password) => {
    if (!validateUsername(username)) throw new Error('Username not invalid')
    if (!validateEmail(email)) throw new Error('Invalid gmail')
    if (!validatePassword(password)) throw new Error('The password must contain more than 8 characters.')

    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (existingUser) throw new Error ('The user already existed')

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