import { Router } from 'express'

import { AuthController } from '../controllers/authController.js'

import { authSession, secondInstanceRegister } from '../middleware/sessionMiddleware.js'
import { SessionController } from '../controllers/sessionController.js'
import { ProfileImageController } from '../controllers/profileImageController.js'

export const authRouter = Router()

authRouter.post('/register', AuthController.register)
authRouter.post('/register-username', secondInstanceRegister, AuthController.registerUsername)
authRouter.get('/profile-images', ProfileImageController.getAllProfileImages)
authRouter.get('/profile-images/:name', ProfileImageController.getProfileImageByName)
authRouter.post('/login', AuthController.login)

authRouter.get('/protected', authSession, SessionController.authorized)
authRouter.post('/logout', SessionController.logout)

export default authRouter
