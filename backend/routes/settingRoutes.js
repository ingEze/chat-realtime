import { Router } from 'express'

import { Search } from '../controllers/userController.js'
import { authSession } from '../middleware/sessionMiddleware.js'
import { SettingController } from '../controllers/settingController.js'

const settingRouter = Router()

settingRouter.patch('/change-username', authSession, SettingController.updateUsername)
settingRouter.get('/usertag', authSession, Search.userTag)

export default settingRouter
