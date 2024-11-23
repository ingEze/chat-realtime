import { Router } from 'express'

import { AuthController } from '../controllers/authController.js'

Router.post('/register', AuthController.register())
Router.post('/username', AuthController.registerUsername())
Router.post('/login', AuthController.login())

module.exports = Router