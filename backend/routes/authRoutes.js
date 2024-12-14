import { Router } from 'express'

import { AuthController } from '../controllers/authController.js'

import { authSession, secondInstanceRegister } from '../middleware/sessionMiddleware.js'
import { SessionController } from '../controllers/sessionController.js'

export const authRouter = Router()

authRouter.post('/register', AuthController.register)
authRouter.post('/register-username', secondInstanceRegister, AuthController.registerUsername)
authRouter.post('/login', AuthController.login)

authRouter.get('/protected', authSession, SessionController.authorized)
authRouter.post('/logout', SessionController.logout)

export default authRouter
