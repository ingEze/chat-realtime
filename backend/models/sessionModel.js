import mongoose from 'mongoose'
import { UserValidation } from '../utils/validation.js'

const pendingRegistrationSchema = new mongoose.Schema({
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
  },
  createdAt: {
    type: Date,
    expires: 3600,
    default: Date.now
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
      message: props => `${props.value} email not valid`
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
          console.error('Username already existed')
        }
      }
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

export async function cleanupIncompleteRegistrations () {
  const oneHourAgo = new Date(Date.now() - 3600000)
  try {
    const result = await User.deleteMany({
      isRegistrationComplete: false,
      createdAt: { $lt: oneHourAgo }
    })
    console.log(`Cleaned up ${result.deletetedCount} incomplete registrations`)
  } catch (err) {
    console.error('Error cleaning up incomplete registrations:', err)
  }
}

export const PendingRegistration = mongoose.model('PendingRegistration', pendingRegistrationSchema)
export const User = mongoose.model('User', userSchema)
export const ProfileImage = mongoose.model('ProfileImage', profileImageSchema)
