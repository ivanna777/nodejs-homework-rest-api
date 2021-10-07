const { Contact } = require('./schema')

const listContacts = async () => Contact.find({})

const getContactById = (id) => Contact.findById(id)

const addContact = async (body) => await Contact.create(body)

const removeContact = (id) => Contact.findByIdAndDelete(id)

const updateContact = (id, body) => Contact.findByIdAndUpdate(id, body)

const updateStatusContact = (id, body) => Contact.findByIdAndUpdate(id, body)

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact
}
