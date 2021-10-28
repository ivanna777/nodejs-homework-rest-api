const express = require('express')
const router = express.Router()
const validation = require('../middlewares/validation')
const ctrlWrapper = require('../middlewares/ctrlWrapper')
const authentication = require('../middlewares/authentiacation')
const upload = require('../middlewares/upload')
const { userJoiSchema } = require('../model/userSchema')
const ctrl = require('../controller/usersCtrl')

router.post('/signup', validation(userJoiSchema), ctrlWrapper(ctrl.register))

router.get('/verify/:verificationToken', ctrlWrapper(ctrl.verify))

router.post('/verify', ctrlWrapper(ctrl.secondVerify))

router.post('/login', validation(userJoiSchema), ctrlWrapper(ctrl.login))

router.get('/logout', authentication, ctrlWrapper(ctrl.logout))

router.get('/current', authentication, ctrlWrapper(ctrl.currentUser))

router.patch('/avatars', authentication, upload.single('avatar'), ctrlWrapper(ctrl.changeAvatar))

module.exports = router
