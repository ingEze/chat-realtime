import mongoose from 'mongoose'
import { UserValidation } from '../utils/validation.js'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
    default: null,
    validate: {
      validator: function (username) {
        return UserValidation.validateUsername(username)
      },
      message: props => `${props.value} no es un usernmae valid`
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (email) {
        return UserValidation.validateEmail(email)
      },
      message: props => `${props.value} email not valid`
    }
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

export const User = mongoose.model('User', userSchema)
