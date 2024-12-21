import { FriendService } from '../services/friendService.js'

export class FriendAdd {
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
}
