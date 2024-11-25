import { authMiddleware } from '../middleware/sessionMiddleware.js'

import { userRouter } from './authRoutes.js'

userRouter.get('/protected-route', authMiddleware.authSession, (req, res) => {
  res.json({
    success: true,
    user: req.user
  })
})
