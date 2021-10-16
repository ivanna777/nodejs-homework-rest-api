const { Unauthorized } = require('http-errors')
const jwt = require('jsonwebtoken')
const { User } = require('../model/userSchema')
const { SECRET_KEY } = process.env

const authentication = async(req, res, next) => {
  const { authorization } = req.headers
  const [bearer, token] = authorization.split(' ')
  if (bearer !== 'Bearer') {
    throw new Unauthorized('Not authorized')
  }
  try {
    const { _id } = jwt.verify(token, SECRET_KEY)
    const user = await User.findById(_id)
    if (!user) {
      throw new Unauthorized('Not authorized')
    }
    req.user = user
    next()
  } catch (error) {
    throw new Unauthorized('Not authorized')
  }
}

module.exports = authentication
