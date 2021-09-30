const express = require('express')
const router = express.Router()
const contactsOperations = require('../../model/index')
const contactSchema = require('../../validation/validation')

router.get('/', async (req, res, next) => {
  try {
    const contacts = await contactsOperations.listContacts()
    console.log(contacts)
    res.json({
      status: 'success',
      code: 200,
      data: {
        result: contacts
      }
    })
  } catch (error) {
    next(error)
  }
})

router.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params
    const contact = await contactsOperations.getContactById(Number(contactId))
    console.log(contactId)

    if (!contact) {
      const error = new Error(`${contactId} not found`)
      error.status = 404
      throw error
    }
    res.json({
      status: 'success',
      code: 200,
      data: {
        contact
      }
    })
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body)
    if (error) {
      const err = new Error('missing required name field')
      err.status = 400
      throw err
    }
    const newContact = await contactsOperations.addContact(req.body)
    res.status(201).json({
      status: 'success',
      code: 201,
      data: {
        newContact
      }
    })
  } catch (error) {
    next(error)
  }
})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params
    const removedContact = await contactsOperations.removeContact(Number(contactId))
    if (!removedContact) {
      const error = new Error(`${contactId} not found`)
      error.status = 404
      throw error
    }
    res.json({
      status: 'success',
      code: 200,
      message: 'contact deleted'
    })
  } catch (error) {
    next(error)
  }
})

router.put('/:contactId', async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body)
    const { contactId } = req.params
    if (error) {
      const err = new Error('missing fields')
      err.status = 400
      throw err
    }
    const updatedContact = await contactsOperations.updateContact(Number(contactId), req.body)
    if (!updatedContact) {
      const err = new Error('Not found')
      err.code = 404
      throw err
    }
    res.json({
      status: 'success',
      code: 200,
      data: { updatedContact }
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
