import { ProfileImage } from '../models/sessionModel.js'

export class UserDataService {
  static async userLoadImage (imageId) {
    try {
      console.log(imageId)
      const profileImage = await ProfileImage.findById(imageId)
      if (!profileImage) {
        throw new Error('Image not found')
      }
      return profileImage.dropboxUrl
    } catch (err) {
      console.error('Error al obtener la imagen:', err.message)
      throw new Error('Error retrieving the image URL', err.message)
    }
  }
}
