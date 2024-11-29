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

userRouter.post('/add', authSession, FriendAdd.sendFriendRequest)
userRouter.post('/accepted', authSession, FriendAdd.acceptedFriendRequest)
userRouter.get('/requests', authSession, FriendAdd.getPendingFriendRequests)
