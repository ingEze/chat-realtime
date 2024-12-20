import { ProfileImage } from '../models/sessionModel.js'

export class UserDataService {
  static async searchUsers (userId) {
    try {
      const profileImage = await ProfileImage.findOne({ _id: userId })
      if (!profileImage) throw new Error('Image not found')
      return profileImage.dropboxUrl
    } catch (err) {
      throw new Error(`Error retrieving the image URL: ${err.message}`)
    }
  }

  static async userLoadImage (imageId) {
    try {
      const profileImage = await ProfileImage.findById(imageId)
      if (!profileImage) {
        throw new Error('Image not found')
      }
      return profileImage.dropboxUrl
    } catch (err) {
      throw new Error('Error retrieving the image URL')
    }
  }
}
