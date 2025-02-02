import { FriendService } from '../services/friendService.js'

export class FriendController {
  static async sendFriendRequest (req, res) {
    try {
      const { username } = req.body
      const requesterId = req.user._id

      if (!username || !requesterId) {
        return res.status(400).json({
          success: false,
          message: 'Bad request'
        })
      }

      const result = await FriendService.sendRequest(requesterId, username)
      console.log('result', result)
      if (!result) {
        console.error('Error sending friend request')
        return res.status(400).json({
          success: false,
          message: 'Error sending friend request'
        })
      }

      res.status(200).json({
        success: true,
        message: 'Friend request sent',
        data: result
      })
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Error sending friend request'
      })
    }
  }

  static async getFriendRequests (req, res) {
    try {
      const requesterId = req.user._id
      if (!requesterId) {
        return res.status(400).json({
          success: false,
          message: 'Bad request'
        })
      }

      const result = await FriendService.getFriendRequests(requesterId)
      if (!result) {
        return res.status(400).json({
          success: false,
          message: 'Error getting friend requests'
        })
      }

      res.status(200).json({
        success: true,
        message: 'Friend requests retrieved',
        data: result
      })
    } catch (err) {}
  }

  static async acceptFriendRequest (req, res) {
    try {
      const { username } = req.body

      const requesterId = req.user._id

      if (!requesterId || !username) {
        return res.status(400).json({
          success: false,
          message: 'Bad request'
        })
      }

      const result = await FriendService.acceptedFriendRequest(requesterId, username)

      if (!result) {
        res.status(400).json({
          success: false,
          message: 'Error accepting friend request'
        })
      }

      res.status(200).json({
        success: true,
        message: 'Friend request accepted',
        data: result
      })
    } catch (err) {
      console.error('error in controller', err.message)
      res.status(500).json({
        success: false,
        message: 'Error accepting friend request'
      })
    }
  }

  static async getFriends (req, res) {
    try {
      const userId = req.user._id
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authorized'
        })
      }

      const result = await FriendService.getFriends(userId)
      if (!result) {
        return res.status(400).json({
          success: false,
          message: 'Error getting friends'
        })
      }

      const resultFormatted = result.map(friend => ({
        ...friend,
        timestamp: new Date(friend.timestamp).toLocaleString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      }))
      console.log('resultFormatted', resultFormatted)
      res.status(200).json({
        success: true,
        message: 'Friends retrieved',
        data: resultFormatted
      })
    } catch (err) {
      console.log('error in controller', err.message)
      res.status(500).json({
        success: false,
        message: 'Error getting friends'
      })
    }
  }
}
