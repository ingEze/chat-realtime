import { Server } from 'socket.io'
import { ACCEPTED_ORIGINS } from '../config/cors.js'
import { ChatService } from './services/chatService.js'

let io

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

    socket.on('joinChat', ({ sender, recipient }) => {
      const room = [sender, recipient].sort().join('-')
      socket.join(room)
    })

    socket.on('sendMessage', async ({ sender, recipient, message }) => {
      try {
        const savedMessage = await ChatService.sendMessage({
          sender,
          recipientUsername: recipient,
          message: message.message
        })

        if (savedMessage) {
          const room = [sender, recipient].sort().join('-')
          io.to(room).emit('receiveMessage', {
            message: savedMessage.message,
            sender: savedMessage.sender,
            timestamp: savedMessage.timestamp
          })
        }
      } catch (err) {
        console.error('Error in sendMessage socket:', err)
        socket.emit('messageError', { success: false, message: err.message })
      }
    })

    socket.on('disconnect', () => {
      console.log('User disconnected', socket.id)
    })
  })
  return io
}

export { initSocket, io }
