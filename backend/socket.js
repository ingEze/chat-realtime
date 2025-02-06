import { Server } from 'socket.io'
import { ACCEPTED_ORIGINS } from '../config/cors.js'
import { ChatService } from './services/chatService.js'
import { Chat } from './models/chatModel.js'

let io
const userSockets = new Map()

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ACCEPTED_ORIGINS,
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
      credentials: true
    }
  })

  io.on('connection', (socket) => {
    console.log('User connected', socket.id)

    socket.on('messagesRead', async ({ sender, recipient }) => {
      try {
        const result = await Chat.updateMany(
          { sender, recipient, read: false },
          { $set: { read: true } }
        )

        console.log('update message:', result.modifiedCount)

        io.to(sender).emit('messagesRead', { recipient })
      } catch (err) {
        console.error('Error in messageRead:', err.message)
      }
    })

    socket.on('joinChat', async ({ sender, recipient }) => {
      console.log('recipient', recipient)
      try {
        const senderUser = await ChatService.getUsernameById(sender)
        if (!senderUser) {
          throw new Error('Sender user not found')
        }

        userSockets.set(senderUser.username, socket.id)

        const recipientUser = await ChatService.getUserData(recipient)
        if (!recipientUser) {
          throw new Error('Recipient user not found')
        }

        if (!senderUser.username || !recipientUser.username) {
          throw new Error('Invalid usernames for chat room')
        }

        const room = [senderUser.username, recipientUser.username].sort().join('-')
        socket.join(room)
        console.log(`User ${senderUser.username} joined room ${room}`)

        const recipientSocketId = userSockets.get(recipientUser.username)
        if (recipientSocketId) {
          const recipientSocketObj = io.sockets.sockets.get(recipientSocketId)
          if (recipientSocketObj) {
            recipientSocketObj.join(room)
            console.log(`User ${recipientUser.username} joined room ${room}`)
          }
        }
        socket.emit('joinedChat', { room })
      } catch (err) {
        console.error('Error in joinChat socket:', err)
        socket.emit('chatError', { message: 'Error joining chat' })
      }
    })

    socket.on('sendMessage', async ({ sender, recipient, message }) => {
      try {
        const savedMessage = await ChatService.sendMessage({
          sender,
          recipientUsername: recipient,
          message: typeof message === 'string' ? message : message.message
        })

        const timestampFormatted = new Date(savedMessage.timestamp).toLocaleString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        })

        if (savedMessage) {
          const senderUser = await ChatService.getUsernameById(sender)
          const recipientUser = await ChatService.getUserDataById(recipient)

          const room = [senderUser.username, recipientUser.username].sort().join('-')

          io.in(room).emit('receiveMessage', {
            message: savedMessage.message,
            sender: savedMessage.sender,
            recipient: savedMessage.recipient,
            timestamp: timestampFormatted,
            read: savedMessage.read || false
          })

          const roomMembers = io.sockets.adapter.rooms.get(room)
          console.log(`Room ${room} members: `, roomMembers ? Array.from(roomMembers) : 'No members')
        } else {
          console.error('Message not saved')
        }
      } catch (err) {
        console.error('Error in sendMessage socket:', err.message)
        socket.emit('messageError', { success: false, message: err.message })
      }
    })

    socket.on('disconnect', () => {
      for (const [username, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(username)
          console.log(`User ${username} disconnected`)
          break
        }
      }
    })
  })
  return io
}

export { initSocket, io }
