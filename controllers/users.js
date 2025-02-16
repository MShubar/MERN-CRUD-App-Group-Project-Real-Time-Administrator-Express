const User = require('../models/User')
const bcrypt = require('bcrypt')
const { signToken } = require('../middleware/jwt')

const createUser = async (email, password, role = 'employee') => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({
      email,
      password: hashedPassword,
      role
    })
    await user.save()
    return user
  } catch (error) {
    throw new Error(error.message)
  }
}
const updateUser = async (email, password, userId, res) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = { email, password: hashedPassword };
    
    const updatedUser = await User.findByIdAndUpdate(userId, userData, { new: true });

    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ error: error.message });
  }
};
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing required fields.' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' })
    }

    const matched = bcrypt.compareSync(password, user.password)
    if (!matched) {
      return res.status(400).json({ error: 'Invalid email or password.' })
    }

    const token = signToken(user)
    console.log(token)
    console.log(user)
    return res.status(200).json({ message: 'Login successful.', token, user })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong!' })
  }
}

const profile = async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(400).json({ error: 'No user found or token is invalid.' })
  }
  try {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ error: 'User not found.' })
    return res.status(200).json(user)
  } catch (error) {
    console.error('Error in profile route:', error)
    res.status(500).json({ error: 'Something went wrong!' })
  }
}

module.exports = { createUser, signIn, profile , updateUser}
