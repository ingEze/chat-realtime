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

  static async rejectFriendRequest (req, res) {
    try {
      const userId = req.user._id
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authorized'
        })
      }

      const { username } = req.body
      if (!username) {
        return res.status(400).json({
          success: false,
          message: 'Bad request'
        })
      }

      const result = await FriendService.rejectFriendRequest(userId, username)

      if (!result) {
        return res.status(400).json({
          success: false,
          message: 'Error rejecting friend request'
        })
      }

      res.status(200).json({
        success: true,
        message: 'Friend request rejected',
        data: result
      })
    } catch (err) {
      console.error('error in controller', err.message)
      res.status(500).json({
        success: false,
        message: 'Error rejecting friend request'
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
        timestamp: friend.timestamp !== 'N/A'
          ? new Date(friend.timestamp).toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })
          : 'N/A'
      }))
      if (!resultFormatted) {
        return res.status(400).json({
          success: false,
          message: 'Error getting friends'
        })
      }
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

  static async removeFriend (req, res) {
    try {
      const userId = req.user._id
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authorized'
        })
      }

      const { username } = req.body
      if (!username) {
        return res.status(400).json({
          success: false,
          message: 'Bad request'
        })
      }

      const result = await FriendService.removeFriend(userId, username)
      if (!result) {
        return res.status(400).json({
          success: false,
          message: 'Error removing friend'
        })
      }

      res.status(200).json({
        success: true,
        message: 'Friend removed',
        data: result
      })
    } catch (err) {
      console.error('error in controller', err.message)
      res.status(500).json({
        success: false,
        message: 'Error removing friend'
      })
    }
  }

  static async verifyFriend (req, res) {
    try {
      const userId = req.user._id
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authorized'
        })
      }

      const { username } = req.query
      if (!username) {
        return res.status(400).json({
          success: false,
          message: 'Bad request'
        })
      }

      const result = await FriendService.verifyFriend(userId, username)
      if (!result) {
        return res.status(400).json({
          success: false,
          message: 'Error verifying friend'
        })
      }

      res.status(200).json({
        success: true,
        message: 'Friend verified',
        data: result
      })
    } catch (err) {
      console.error('error in controller', err.message)
      res.status(500).json({
        success: false,
        message: 'Error verifying friend'
      })
    }
  }
}
