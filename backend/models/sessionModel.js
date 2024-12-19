import mongoose from 'mongoose'
import { UserValidation } from '../utils/validation.js'

const pendingRegistrationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: false,
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
  },
  createdAt: {
    type: Date,
    expires: 3600,
    default: Date.now
  }
})

pendingRegistrationSchema.indexes().forEach(index => {
  if (index[0].email === 1) {
    pendingRegistrationSchema.index({ email: 1 }, { unique: false })
  }
})

const userSchema = new mongoose.Schema({
  profileImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProfileImage'
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (email) {
        return UserValidation.validateEmail(email)
      },
      message: props => `${props.value} is not a valid email`
    }
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
    default: null,
    validate: {
      validator: async function (username) {
        if (!username) {
          return false
        }
        const existingUser = await mongoose.models.User.findOne({ username })
        return !existingUser
      },
      message: 'Username already exists'
    }
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

export const PendingRegistration = mongoose.model('PendingRegistration', pendingRegistrationSchema)
export const User = mongoose.model('User', userSchema)
export const ProfileImage = mongoose.model('ProfileImage', profileImageSchema)
