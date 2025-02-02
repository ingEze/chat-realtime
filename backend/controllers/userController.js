import { User } from '../models/sessionModel.js'
import { UserDataService } from '../services/userService.js'

export class Search {
  static async searchUsers (req, res) {
    try {
      const { q } = req.query

      if (!q || q.trim() === '') {
        return res.status(400).json({
          message: 'Query is required'
        })
      }

      const users = await User.find({
        username: { $regex: q, $options: 'i' },
        _id: { $ne: req.user._id }
      }).select('username profileImage')

      const resolvedUsers = await Promise.all(
        users.map(async (user) => {
          const imageUrl = user.profileImage
            ? await UserDataService.searchUsers(user.profileImage)
            : null
          return {
            username: user.username,
            profileImage: imageUrl
          }
        })
      )

      res.json(resolvedUsers)
    } catch (err) {
      console.error('Error searching users: ', err)
      res.status(500).json({
        success: false,
        message: 'Error searching users'
      })
    }
  }
}

export class UserController {
  static async userTag (req, res) {
    try {
      if (!req.user || !req.user._id) {
        return res.status(401).json({
          success: false,
          message: 'No authenticate'
        })
      }

      if (!req.user.username) return res.send('Invited')

      res.send(req.user.username)
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Error in server, not username'
      })
    }
  }

  static async profileImageLoad (req, res) {
    try {
      const user = req.user
      const imageId = user.profileImage

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not authorized'
        })
      }

      if (!imageId) {
        return res.status(400).json({
          success: false,
          message: 'Image ID is required'
        })
      }

      const imageUrl = await UserDataService.userLoadImage(imageId)
      return res.status(200).json({
        success: true,
        imageUrl
      })
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message || 'Error load image'
      })
    }
  }
}
