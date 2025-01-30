import { Router } from 'express'

import { authSession, routeProtected } from '../middleware/sessionMiddleware.js'
import { UserController } from '../controllers/userController.js'

const protectedUserRouter = Router()

protectedUserRouter.get('/user/data', routeProtected)
protectedUserRouter.get('/user/profile-image', authSession, UserController.profileImageLoad)

protectedUserRouter.get('/usertag', authSession, UserController.userTag)

export default protectedUserRouter
