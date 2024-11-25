import { Router } from 'express'

import { AuthController } from '../controllers/authController.js'

export const userRouter = Router()

userRouter.post('/register', AuthController.register)
userRouter.post('/register-username', AuthController.registerUsername)
userRouter.post('/login', AuthController.login)
