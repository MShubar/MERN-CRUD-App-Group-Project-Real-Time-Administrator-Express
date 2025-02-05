const jwt = require('jsonwebtoken')
const User = require('../models/User')

const signToken = (user) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  })
  return token
}

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}
const checkUser = async (req, res, next) => {
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing required fields.' })
  }
  const userExist = await User.findOne({ email })
  if (userExist) {
    return res.status(409).json({ error: 'Email already taken.' })
  }
}
module.exports = {
  signToken,
  verifyToken,
  checkUser
}
