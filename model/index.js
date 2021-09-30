const fs = require('fs/promises')
const path = require('path')
const { v4: uuidv4 } = require('uuid')

const contacts = require('./contacts.json')
const filePath = path.join(__dirname, 'contacts.json')

const listContacts = async () => contacts

const getContactById = async (contactId) => {
  const contact = await contacts.find(contact => contact.id === contactId)
  if (!contact) {
    return null
  }
  return contact
}

const addContact = async (body) => {
  const newContact = { ...body, id: uuidv4() }
  console.log(newContact)
  contacts.push(newContact)

  await fs.writeFile(filePath, JSON.stringify(contacts))

  return newContact
}

const updateContact = async (contactId, body) => {
  const idx = contacts.findIndex(contact => contact.id === contactId)
  if (idx === -1) {
    return null
  }
  const updatedContact = { ...contacts[idx], ...body }
  contacts[idx] = updatedContact
  console.log(updatedContact)
  await fs.writeFile(filePath, JSON.stringify(contacts))
  return updatedContact
}

const removeContact = async (contactId) => {
  const idx = contacts.findIndex(contact => contact.id === contactId)
  if (idx === -1) {
    return null
  }
  contacts.splice(idx, 1)
  await fs.writeFile(filePath, JSON.stringify(contacts))
  return 'success remove'
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
