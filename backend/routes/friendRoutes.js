import { Router } from 'express'

import { FriendController } from '../controllers/friendController.js'
import { authSession } from '../middleware/sessionMiddleware.js'
import { Search } from '../controllers/userController.js'

const friendRouter = Router()

friendRouter.post('/add', authSession, FriendController.sendFriendRequest)
friendRouter.get('/requests', authSession, FriendController.getFriendRequests)
friendRouter.post('/accepted', authSession, FriendController.acceptFriendRequest)

friendRouter.get('/user/friend', authSession, FriendController.getFriends)

friendRouter.get('/search', authSession, Search.searchUsers)

export default friendRouter
