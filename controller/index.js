const service = require('../model/index')
const { contactJoiSchema, updateFavoriteJoiSchema } = require('../model/schema')

const getAll = async (req, res, next) => {
  try {
    const contacts = await service.listContacts()
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
}

const getById = async (req, res, next) => {
  try {
    const { contactId } = req.params
    const contact = await service.getContactById(contactId)
    console.log(contact)

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
}

const addContact = async (req, res, next) => {
  try {
    const { error } = contactJoiSchema.validate(req.body)
    if (error) {
      const err = new Error('missing required name field')
      err.status = 400
      throw err
    }
    const newContact = await service.addContact(req.body)
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
}

const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params
    const removedContact = await service.removeContact(contactId)
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
}

const updateContact = async(req, res, next) => {
  try {
    const { error } = contactJoiSchema.validate(req.body)
    const { contactId } = req.params
    if (error) {
      const err = new Error('missing fields')
      err.status = 400
      throw err
    }
    const updatedContact = await service.updateContact(contactId, req.body, { new: true })
    console.log(updatedContact)
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
}

const favoriteContact = async(req, res, next) => {
  try {
    const { error } = updateFavoriteJoiSchema.validate(req.body)
    const { contactId } = req.params
    const { favorite } = req.body
    if (error) {
      const err = new Error('missing fields')
      err.status = 400
      throw err
    }
    const contact = await service.updateStatusContact(contactId, { favorite })
    console.log(req.body)
    if (!contact) {
      const err = new Error('Not found')
      err.code = 404
      throw err
    }
    res.json({
      status: 'success',
      code: 200,
      data: { contact }
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAll,
  getById,
  addContact,
  deleteContact,
  updateContact,
  favoriteContact
}
