import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: false,
    unique: true,
    sparse: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
})

userSchema.path('username').validate(function (username) {
  if (this.isModified('username') && !username) {
    throw new Error('Username is required')
  }
}, null)

export const User = mongoose.model('User', userSchema)
