import { ProfileImageService } from '../services/profileImageService.js'

export class ProfileImageController {
  static async getAllProfileImages (req, res) {
    try {
      const profileImageService = new ProfileImageService()
      const images = await profileImageService.getAllProfileImages()
      res.json(images)
    } catch (err) {
      console.error('Error en getAllProfileImages(Controller)', err)
      res.status(500).json({
        success: false,
        message: 'Error obtaining images'
      })
    }
  }

  static async getProfileImageByName (req, res) {
    try {
      const { name } = req.params
      const profileImageService = new ProfileImageService()
      const image = await profileImageService.getProfileImageByName(name)

      if (!image) {
        return res.status(404).json({
          success: false,
          message: 'Image not found'
        })
      }

      res.json(image)
    } catch (err) {
      console.error('Error in ProfileImageController: ', err)
      res.status(500).json({
        success: false,
        message: 'Error obtain image'
      })
    }
  }
}
