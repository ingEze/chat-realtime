import { Chat } from '../models/chatModel.js'
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
        $or: [
          { requester: requesterId, recipient: recipiendId, status: 'accepted' },
          { requester: recipiendId, recipient: requesterId, status: 'accepted' }
        ]
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

  static async acceptedFriendRequest (requesterId, username) {
    try {
      const recipient = await User.findOne({ username })
      if (!recipient) throw new Error('User not found')

      const requester = await User.findById(requesterId)
      if (!requester) throw new Error('User not found')

      const existingRequest = await Friendship.findOne({
        $or: [
          { requester: requester._id, recipient: recipient._id, status: 'pending' },
          { requester: recipient._id, recipient: requester._id, status: 'pending' }
        ]
      })

      if (!existingRequest) throw new Error('Request not found')

      const [updateRequester, updateRecipient] = await Promise.all([
        User.findByIdAndUpdate(
          requester._id,
          { $addToSet: { friends: recipient._id } },
          { new: true }
        ),
        User.findByIdAndUpdate(
          recipient._id,
          { $addToSet: { friends: requester._id } },
          { new: true }
        )
      ])

      await Friendship.updateOne(
        { _id: existingRequest._id },
        { $set: { status: 'accepted' } }
      )

      if (!updateRequester || !updateRecipient) throw new Error('Error accepting friend request')

      return {
        requester: updateRequester,
        recipient: updateRecipient,
        existingRequest
      }
    } catch (err) {
      console.error('err in service', err.message)
      throw new Error(err.message || 'Error accepting friend request')
    }
  }

  static async rejectFriendRequest (requesterId, username) {
    try {
      const recipient = await User.findOne({ username })
      if (!recipient) throw new Error('User not found')

      const requester = await User.findById(requesterId)
      if (!requester) throw new Error('User not found')

      const existingRequest = await Friendship.findOne({
        $or: [
          { requester: requester._id, recipient: recipient._id, status: 'pending' },
          { requester: recipient._id, recipient: requester._id, status: 'pending' }
        ]
      })

      if (!existingRequest) throw new Error('Request not found')

      await Friendship.deleteOne({ _id: existingRequest._id })

      return true
    } catch (err) {}
  }

  static async getFriends (userId) {
    try {
      const user = await User.findById(userId)
        .populate({
          path: 'friends',
          select: 'username profileImage',
          populate: {
            path: 'profileImage',
            select: 'dropboxUrl'
          }
        })
      if (!user) throw new Error('User not found')

      const messageData = await Promise.all(
        user.friends.map(async (friend) => {
          const chat = await Chat.findOne({
            $or: [
              { sender: userId, recipient: friend._id },
              { sender: friend._id, recipient: userId }
            ]
          })
            .sort({ createdAt: -1 })
            .populate({
              path: 'message',
              options: { sort: { createdAt: -1 }, limit: 1 },
              select: 'createdAt message'
            })

          return {
            username: friend.username,
            profileImage: friend.profileImage?.dropboxUrl,
            timestamp: chat?.timestamp ? chat.timestamp : 'N/A',
            message: chat?.message ? chat.message : 'No messages yet'
          }
        })
      )

      if (!messageData) throw new Error('Error getting friends')

      return messageData
    } catch (err) {
      console.error('err in service', err.message)
      throw new Error(err.message || 'Error getting friends')
    }
  }

  static async removeFriend (userId, username) {
    try {
      const user = await User.findById(userId)
      if (!user) throw new Error('User not found')

      const friend = await User.findOne({ username })
      if (!friend) throw new Error('Friend not found')

      await User.updateOne(
        { _id: userId },
        { $pull: { friends: friend._id } }
      )

      await User.updateOne(
        { _id: friend._id },
        { $pull: { friends: userId } }
      )

      return true
    } catch (err) {
      console.error('err in service', err.message)
      throw new Error(err.message || 'Error removing friend')
    }
  }

  static async verifyFriend (userId, username) {
    try {
      const user = await User.findById(userId)
      if (!user) throw new Error('User not found')

      const friend = await User.findOne({ username })
      if (!friend) throw new Error('Friend not found')

      const result = await Friendship.findOne({
        $or: [
          { requester: userId, recipient: friend._id, status: 'accepted' },
          { requester: friend._id, recipient: userId, status: 'accepted' }
        ]
      })

      console.log('result in service', result)

      if (!result) {
        console.error('friend not found')
        throw new Error('Friend not found')
      }

      return result
    } catch (err) {
      console.error('err in service', err.message)
      throw new Error(err.message || 'Error verifying friend')
    }
  }
}
