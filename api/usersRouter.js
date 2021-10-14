const express = require('express')
const router = express.Router()
const validation = require('../middlewares/validation')
const ctrlWrapper = require('../middlewares/ctrlWrapper')
const authentication = require('../middlewares/authentiacation')
const { userJoiSchema } = require('../model/userSchema')
const ctrl = require('../controller/usersCtrl')

router.post('/signup', validation(userJoiSchema), ctrlWrapper(ctrl.register))

router.post('/login', validation(userJoiSchema), ctrlWrapper(ctrl.login))

router.get('/logout', authentication, ctrlWrapper(ctrl.logout))

router.get('/current', authentication, ctrlWrapper(ctrl.currentUser))

module.exports = router
