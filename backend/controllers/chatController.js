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
      console.error('error getting user data', err.message)
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

      const { recipient } = req.body
      if (!recipient) {
        return res.status(400).json({
          success: false,
          message: 'Bad request'
        })
      }

      const result = await ChatService.getRecentMessages(userId, recipient)
      if (!result) {
        return res.status(200).json({
          success: true,
          message: 'No recent messages',
          data: {
            resultMap: [],
            timestamp: []
          }
        })
      }

      const resultMap = result.map(msg => ({
        message: msg.message,
        sender: msg.sender,
        recipient: msg.recipient,
        timestamp: msg.timestamp
      }))

      const timestamp = result.map(msg => msg.timestamp)
      const optionsTimestamp = { hour: '2-digit', minute: '2-digit', hour12: true }
      const formattedTime = timestamp.map(date => date.toLocaleTimeString('en-US', optionsTimestamp))

      res.status(200).json({
        status: true,
        message: 'Recent messages retrieved',
        data: {
          resultMap,
          timestamp: formattedTime
        }
      })
    } catch (err) {
      console.error('Error in getRecentMessages(controller):', err.message)
      res.status(500).json({
        success: false,
        message: 'Error getting recent messages',
        error: err.message
      })
    }
  }

  static async sendMessage (req, res) {
    try {
      const sender = req.user._id
      if (!sender) {
        return res.status(401).json({
          success: false,
          message: 'User not authorized'
        })
      }

      const { message, recipientUsername } = req.body
      if (!message || !recipientUsername) {
        return res.status(400).json({
          success: false,
          message: 'Bad request'
        })
      }

      const result = await ChatService.sendMessage({ recipientUsername, sender, message })
      if (!result) {
        return res.status(400).json({
          success: false,
          message: 'Error sending message'
        })
      }

      return res.status(200).json({
        success: true,
        message: 'Message sent',
        data: { message: result.message }
      })
    } catch (err) {
      console.error('Error in sendMessage(controller):', err.message)
      return res.status(500).json({
        success: false,
        message: 'Error sending message'
      })
    }
  }
}
