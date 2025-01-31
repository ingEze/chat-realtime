import { Router } from 'express'

import { authSession } from '../middleware/sessionMiddleware.js'
import { ChatController } from '../controllers/chatController.js'

const chatRouter = Router()

chatRouter.get('/user/data', authSession, ChatController.getUserData)

chatRouter.post('/recent/message', authSession, ChatController.getRecentMessages)
chatRouter.post('/send/message', authSession, ChatController.sendMessage)

export default chatRouter
