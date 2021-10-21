const gravatar = require('gravatar')
const Jimp = require('jimp')
const path = require('path')
const fs = require('fs/promises')
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
  const avatar = gravatar.url(email)
  newUser.avatarURL = avatar
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
  const token = user.createToken()
  await User.findByIdAndUpdate(user._id, { token })

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

const changeAvatar = async(req, res) => {
  const avatarsDir = path.join(__dirname, '../', 'public/avatars')
  const { path: tmpStorage, originalname } = req.file
  try {
    const originalAvatar = await Jimp.read(tmpStorage)
    await originalAvatar.resize(250, 250).writeAsync(tmpStorage)
    const [extention] = originalname.split('.').reverse()
    const renameAvatar = `avatar_${req.user._id}.${extention}`
    const renameStorage = path.join(avatarsDir, renameAvatar)
    await fs.rename(tmpStorage, renameStorage)
    const avatar = path.join('/avatars', renameAvatar)
    const { avatarURL } = await User.findByIdAndUpdate(req.user._id, { avatarURL: avatar }, { new: true })

    res.send.json({
      status: 'success',
      code: 200,
      data: {
        avatarURL
      }
    })
  } catch (error) {
    await fs.unlink(tmpStorage)
    console.log(error)
  }
}

module.exports = {
  register,
  login,
  logout,
  currentUser,
  changeAvatar
}
