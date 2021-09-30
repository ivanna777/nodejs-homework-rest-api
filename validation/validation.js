const Joi = require('joi')

const schema = Joi.object({
  name: Joi.required(),
  email: Joi.required(),
  phone: Joi.required()
})

module.exports = schema
