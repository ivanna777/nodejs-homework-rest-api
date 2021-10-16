const { User } = require('../model/userSchema')
const { Conflict, BadRequest, Unauthorized } = require('http-errors')

const register = async(req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (user) {
    throw new Conflict('Email in use')
  }
  const newUser = new User({ email })
  newUser.setPassword(password)
  await newUser.save()
  res.status(201).json({
    status: 'success',
    code: 201,
    data: {
      newUser
    }
  })
}

const login = async(req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user || !user.comparePassword(password)) {
    throw new BadRequest('Email or password is wrong')
  }
  // const { _id } = user
  const token = user.createToken()
  await User.findByIdAndUpdate(user._id, { token })

  // const token = 'hgdjhsdjkfjsdkl'
  res.json({
    status: 'success',
    code: 200,
    data: {
      token
    }
  })
}

const logout = async(req, res) => {
  const { _id } = req.user
  await User.findByIdAndUpdate(_id, { token: null })
  res.status(204).json({
    status: 'success',
    code: 204,
    message: 'No Content'
  })
}

const currentUser = async(req, res) => {
  const { token } = req.user
  const userByToken = await User.findOne({ token })
  if (!userByToken) {
    throw new Unauthorized('Not authorized')
  }
  res.json({
    status: 'success',
    code: 200,
    data: {
      userByToken
    }
  })
}

module.exports = {
  register,
  login,
  logout,
  currentUser
}
