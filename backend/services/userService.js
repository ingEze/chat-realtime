import { ProfileImage, User } from '../models/sessionModel.js'
import { Friendship } from '../models/friendModel.js'

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

  static async searchExistingUsers (user, q) {
    try {
      const userLogged = await User.findById(user)
      if (!user) throw new Error('User not found')

      const searchedFriend = await User.findOne({ username: q })
      if (!searchedFriend) {
        throw new Error('User not found')
      }

      const friendship = await Friendship.findOne({
        $or: [
          { requester: userLogged._id, recipient: searchedFriend._id, status: 'accepted' },
          { requester: searchedFriend._id, recipient: userLogged._id, status: 'accepted' }
        ]
      })

      if (friendship) {
        return {
          username: searchedFriend.username,
          profileImage: await this.userLoadImage(searchedFriend.profileImage)
        }
      }
    } catch (err) {
      throw new Error('Error searching users')
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
