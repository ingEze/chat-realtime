import { Router } from 'express'

import { AuthController } from '../controllers/authController.js'
import { FriendAdd } from '../controllers/friendController.js'
import { authSession } from '../middleware/sessionMiddleware.js'
import { Search } from '../controllers/userController.js'
import { SessionController } from '../controllers/sessionController.js'

export const userRouter = Router()

userRouter.post('/register', AuthController.register)
userRouter.post('/register-username', AuthController.registerUsername)
userRouter.post('/login', AuthController.login)

userRouter.get('/protected', authSession, SessionController.authorized)

userRouter.get('/search', authSession, Search.searchUsers)
userRouter.post('/logout', SessionController.logout)

userRouter.post('/friends/add', authSession, FriendAdd.sendFriendRequest)
userRouter.post('/friends/accepted', authSession, FriendAdd.acceptedFriendRequest)
userRouter.get('/friends/requests', authSession, FriendAdd.getPendingFriendRequests)

userRouter.get('/usertag', authSession, Search.userTag)
