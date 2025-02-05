import { Router } from 'express'

import { FriendController } from '../controllers/friendController.js'
import { authSession } from '../middleware/sessionMiddleware.js'
import { Search } from '../controllers/userController.js'

const friendRouter = Router()

friendRouter.post('/add', authSession, FriendController.sendFriendRequest)
friendRouter.post('/remove', authSession, FriendController.removeFriend)
friendRouter.get('/requests', authSession, FriendController.getFriendRequests)
friendRouter.post('/accepted', authSession, FriendController.acceptFriendRequest)
friendRouter.post('/rejected', authSession, FriendController.rejectFriendRequest)

friendRouter.get('/user/friend', authSession, FriendController.getFriends)

friendRouter.get('/search', authSession, Search.searchUsers)
friendRouter.get('/search/existing', authSession, Search.searchExistingUsers)

friendRouter.get('/verify', authSession, FriendController.verifyFriend)

export default friendRouter
