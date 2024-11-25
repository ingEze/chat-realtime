<<<<<<< HEAD
import { Router } from 'express'

import { AuthController } from '../controllers/authController.js'

export const userRouter = Router()

userRouter.post('/register', AuthController.register)
userRouter.post('/register-username', AuthController.registerUsername)
userRouter.post('/login', AuthController.login)
=======
import { Router } from 'express'

import { AuthController } from '../controllers/authController.js'

export const userRouter = Router()

userRouter.post('/register', AuthController.register)
userRouter.post('/register-username', AuthController.registerUsername)
userRouter.post('/login', AuthController.login)
>>>>>>> 48b0b8203183789199cab7330fa8974f93575e60
