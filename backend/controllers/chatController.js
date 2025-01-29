import { ChatService } from '../services/chatService.js'

export class ChatController {
  static async getUserData (req, res) {
    try {
      const { username } = req.query
      if (!username) {
        return res.status(400).json({
          success: false,
          message: 'Bad request'
        })
      }

      const result = await ChatService.getUserData(username)
      if (!result) {
        return res.status(400).json({
          success: false,
          message: 'Error getting user data'
        })
      }

      res.status(200).json({
        success: true,
        message: 'User data retrived',
        data: result
      })
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Error getting user data',
        error: err.message
      })
    }
  }

  static async getRecentMessages (req, res) {
    try {
      const userId = req.user._id
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authorized'
        })
      }

      const result = await ChatService.getRecentMessages(userId)
      if (!result || result.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Error getting recent messages'
        })
      }

      res.status(200).json({
        status: true,
        message: 'Recent messages retrieved',
        data: result
      })
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Error getting recent messages',
        error: err.message
      })
    }
  }

  static async sendMessage (req, res) {
    try {
      const userId = req.user._id
      if (!userId) {
        return res.stauts(401).json({
          success: false,
          message: 'User not authorized'
        })
      }
      const { message, recipientUsername } = req.body

      if (!message) {
        return res.status(400).json({
          success: false,
          message: 'Bad request'
        })
      }

      const result = await ChatService.sendMessage({ recipientUsername, sender: userId, message })
      if (!result) {
        return res.status(400).json({
          success: false,
          message: 'Error sending message'
        })
      }

      res.status(200).json({
        success: true,
        message: 'Message sent',
        data: { message: result.message }
      })
    } catch (err) {
      console.error('Error in sendMessage(controller):', err.message)
      res.status(500).json({
        success: false,
        message: 'Error sending message'
      })
    }
  }
}
