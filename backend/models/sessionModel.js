import mongoose from 'mongoose'
import { UserValidation } from '../utils/validation.js'

const userSchema = new mongoose.Schema({
  profilePhoto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProfileImage'
  },
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
      message: props => `${props.value} username not valid`
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

const profileImageSchema = new mongoose.Schema({
  name: {
    type: String,
    sparse: true,
    default: null
  },
  dropboxUrl: {
    type: String,
    required: true
  }
}, { collection: 'profileImage' })

export const User = mongoose.model('User', userSchema)
export const ProfileImage = mongoose.model('ProfileImage', profileImageSchema)
