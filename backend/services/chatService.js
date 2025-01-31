import { User } from '../models/sessionModel.js'
import { Chat } from '../models/chatModel.js'

export class ChatService {
  static async getUserData (username) {
    try {
      const user = await User.findOne({ username })
      const userId = user._id
      if (!user) throw new Error('User not found')

      const imageUrl = await User.findById(userId)
        .populate({
          path: 'profileImage',
          select: 'dropboxUrl'
        })
      if (!imageUrl) throw new Error('Image not found')

      user.imageUrl = imageUrl.profileImage?.dropboxUrl
      return {
        username: user.username,
        profileImage: user.imageUrl
      }
    } catch (err) {
      console.error('Error in getUserData:', err.message)
      throw new Error('Error getting user data', err.message)
    }
  }

  static async getRecentMessages (userId) {
    try {
      const user = await User.findById(userId)
      const chat = await Chat.find({
        $or: [
          { sender: user._id },
          { recipient: user._id }
        ]
      }).populate('sender recipient')

      const messages = chat.map(chat => ({
        message: chat.message,
        sender: chat.sender._id,
        recipient: chat.recipient._id,
        timestamp: chat.timestamp
      }))

      return messages
    } catch (err) {
      console.error('Error in getRecentMessages:', err.message)
      throw new Error('Error sending message', err.message)
    }
  }

  static async sendMessage ({ sender, recipientUsername, message }) {
    try {
      if (!sender || !recipientUsername || !message) throw new Error('Missing required parameters')

      const senderUser = await User.findById(sender)
      if (!senderUser) throw new Error('Sender user not found')

      const recipientUser = await User.findOne({ username: recipientUsername })
      if (!recipientUser) throw new Error('Recipient user not found')

      const newChat = await Chat.create({
        sender: senderUser._id,
        recipient: recipientUser._id,
        message
      })
      if (!newChat) throw new Error('Error creating chat')

      return newChat
    } catch (err) {
      console.error('Error in sendMessage(service):', err.message)
      throw new Error('Error sending message', err.message)
    }
  }
}
