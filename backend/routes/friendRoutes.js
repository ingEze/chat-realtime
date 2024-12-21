import { Router } from 'express'

import { FriendAdd } from '../controllers/friendController.js'
import { authSession } from '../middleware/sessionMiddleware.js'
import { Search } from '../controllers/userController.js'

const friendRouter = Router()

friendRouter.post('/add', authSession, FriendAdd.sendFriendRequest)
friendRouter.post('/accepted', authSession)
friendRouter.get('/requests', authSession, FriendAdd.getFriendRequests)

friendRouter.get('/search', authSession, Search.searchUsers)

export default friendRouter
