const express = require('express')
const router = express.Router()
const ctrl = require('../controller/contactsCtrl')

router.get('/', ctrl.getAll)

router.get('/:contactId', ctrl.getById)

router.post('/', ctrl.addContact)

router.delete('/:contactId', ctrl.deleteContact)

router.put('/:contactId', ctrl.updateContact)

router.patch('/:contactId/favorite', ctrl.favoriteContact)

module.exports = router
