import { Friendship } from '../models/friendModel.js'
import { User } from '../models/sessionModel.js'

import moment from 'moment'

function timeElapsed (messageTimestamp) {
  const messageDate = moment(messageTimestamp)
  return messageDate.fromNow()
}

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

  static async getFriendRequests (requesterId) {
    try {
      const requests = await Friendship.find({
        recipient: requesterId,
        status: 'pending'
      }).populate('requester')

      if (!requests) throw new Error('Error getting friend requests')

      const requestUserData = await Promise.all(
        requests.map(async request => {
          const requesterImage = await User.findOne(request.requester._id)
            .populate({
              path: 'profileImage',
              populate: {
                path: 'dropboxUrl'
              }
            })

          const timestampFormat = timeElapsed(request.createdAt)

          return {
            username: request.requester.username,
            timestamp: timestampFormat,
            profileImage: requesterImage.profileImage.dropboxUrl,
            requesterId: request.requester._id
          }
        })
      )

      if (!requestUserData) throw new Error('Error getting friend requests')

      return requestUserData
    } catch (err) {
      throw new Error(err.message || 'Error getting friend requests')
    }
  }
}
