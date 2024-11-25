<<<<<<< HEAD
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
=======
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export const User = mongoose.model('User', userSchema)
>>>>>>> 48b0b8203183789199cab7330fa8974f93575e60
