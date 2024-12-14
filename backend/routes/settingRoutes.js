import { Router } from 'express'

import { Search } from '../controllers/userController.js'
import { authSession } from '../middleware/sessionMiddleware.js'
import { SettingController } from '../controllers/settingController.js'

const settingRouter = Router()

settingRouter.patch('/change-username', authSession, SettingController.updateUsername)
settingRouter.patch('/change-email', authSession, SettingController.updateEmail)
settingRouter.patch('/change-password', authSession, SettingController.updatePassword)

settingRouter.get('/usertag', authSession, Search.userTag)

settingRouter.delete('/delete-account', authSession, SettingController.deleteAccount)

export default settingRouter
