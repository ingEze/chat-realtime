import { Friendship } from '../models/friendModel.js'
import { User } from '../models/sessionModel.js'
export class FriendService {
  static async sendRequest (requesterId, username) {
    try {
      const recipiend = await User.findOne({ username })
      const recipiendId = recipiend._id

      if (!recipiend) throw new Error('User not found')

      const existingRequest = await Friendship.findOne({
        requester: requesterId,
        recipient: recipiendId,
        status: 'pending'
      })

      if (existingRequest) throw new Error('Request already sent')

      const existingFriendship = await Friendship.findOne({
        requester: requesterId,
        recipient: recipiendId,
        status: 'accepted'
      })

      if (existingFriendship) throw new Error('Already friends')

      const newRequest = new Friendship({
        requester: requesterId,
        recipient: recipiendId,
        status: 'pending'
      })

      if (!newRequest) throw new Error('Error sending friend request: newRequest not created')

      return await newRequest.save()
    } catch (err) {
      throw new Error(err.message || 'Error sending friend request')
    }
  }
}
