import { ProfileImage } from '../models/sessionModel.js'
export class ProfileImageService {
  async getAllProfileImages () {
    try {
      const images = await ProfileImage.find()
      return images
    } catch (err) {
      console.error('Error in getAllProfileImages: ', err)
      throw err
    }
  }

  async getProfileImageByName (name) {
    try {
      const image = await ProfileImage.findOne({ name }, 'dropboxUrl')
      return image
    } catch (err) {
      console.error('Error in getProfileImageByName:', err)
      throw err
    }
  }
}
