const Company = require('../models/Company')
const { createUser } = require('./users')
const { signToken } = require('../middleware/jwt') // Ensure this is correctly imported

const signUp = async (req, res) => {
  try {
    console.log('Request Body:', req.body)

    const {
      name,
      address,
      crNumber,
      phone,
      size,
      logoImage,
      crDocument,
      email,
      password
    } = req.body

    if (
      !name ||
      !address ||
      !crNumber ||
      !phone ||
      !size ||
      !logoImage ||
      !crDocument ||
      !email ||
      !password
    ) {
      return res.status(400).json({ error: 'All fields are required' })
    }
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
    }
    const existingCR = await Company.findOne({ crNumber })
    if (existingCR) {
      return res
        .status(400)
        .json({ error: 'Company with CR Number already exists' })
    }
    const user = await createUser(email, password, 'company')
    const company = new Company({
      name,
      address,
      crNumber,
      phone,
      size,
      logoImage,
      crDocument,
      status: 'CR-in-progress',
      userId: [user._id]
    })
    await company.save()
    const token = signToken(user)
    return res.status(201).json({
      message: 'Company registered successfully',
      company,
      token
    })
  } catch (error) {
    console.error('Error:', error)
    return res.status(400).json({ error: error.message })
  }
}

module.exports = { signUp }
