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
