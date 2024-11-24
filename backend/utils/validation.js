export class UserValidation {
  static validateUsername (username) {
    const usernameRegex = /^[a-zA-Z0-9@/_-]+$/
    if (username.length <= 3) throw new Error('Username most be 3 characters long')
    if (username.length > 20) throw new Error('Username maximum length is 20 characters')
    if (!usernameRegex.test(username)) throw new Error('Username can only contain letters, numbers, and symbols @, /, _, -')
    if (!username) throw new Error('Username required')
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
