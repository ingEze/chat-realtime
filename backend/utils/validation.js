<<<<<<< HEAD
import { User } from '../models/sessionModel.js'

export class UserValidation {
  static validateUsername (username) {
    if (username === null) return true

    // Validaciones cuando username no es null
    if (!username) throw new Error('El username no puede estar vacío')
    if (username.length < 3) throw new Error('El username debe tener al menos 3 caracteres')
    if (username.length > 20) throw new Error('El username no puede tener más de 20 caracteres')

    const usernameRegex = /^[a-zA-Z0-9@/_-]+$/
    if (!usernameRegex.test(username)) {
      throw new Error('El username solo puede contener letras, números y los símbolos @, /, _, -')
    }

    return true
  }

  static async isUsernameUnique (username) {
    if (username === null) return true

    const existingUser = await User.findOne({ username })
    if (existingUser) throw new Error('El username ya está en uso')
    return true
  }

  static validateEmail (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  static validatePassword (password) {
    if (typeof password !== 'string') {
      console.error('password validation failed: not a string', password)
      throw new Error('Password must be a string')
    }
    return password.length >= 8
  }
}
=======
export class UserValidation {
  static validateUsername (username) {
    const usernameRegex = /^[a-zA-Z0-9@/_-]+$/
    if (username.length <= 3) throw new Error('Username most be 3 characters long')
    if (username.length > 50) throw new Error('Username maximum length is 50 characters')
    if (!usernameRegex.test(username)) throw new Error('Username can only contain letters, numbers, and symbols @, /, _, -')
  }

  static validateEmail (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  static validatePassword (password) {
    return password.length >= 8
  }
}
>>>>>>> 48b0b8203183789199cab7330fa8974f93575e60
