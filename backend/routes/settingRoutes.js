import { Router } from 'express'

import { authSession } from '../middleware/sessionMiddleware.js'
import { SettingController } from '../controllers/settingController.js'

const settingRouter = Router()

settingRouter.patch('/change-username', authSession, SettingController.updateUsername)
settingRouter.patch('/change-email', authSession, SettingController.updateEmail)
settingRouter.patch('/change-password', authSession, SettingController.updatePassword)

settingRouter.patch('/update-profile-image', authSession, SettingController.updateProfileImage)

settingRouter.delete('/delete-account', authSession, SettingController.deleteAccount)

export default settingRouter
