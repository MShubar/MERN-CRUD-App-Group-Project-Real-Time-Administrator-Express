const Company = require('../models/Company')
const { createUser } = require('./users')
const { signToken } = require('../middleware/jwt')
const { uploadToAzure } = require('./uploadToAzure')

const signUp = async (req, res) => {
  try {
    console.log('Request Body:', req.body)

    const { name, address, crNumber, phone, size, email, password } = req.body
    if (
      !name ||
      !address ||
      !crNumber ||
      !phone ||
      !size ||
      !email ||
      !password
    ) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser)
      return res.status(400).json({ error: 'User already exists' })

    const existingCR = await Company.findOne({ crNumber })
    if (existingCR)
      return res
        .status(400)
        .json({ error: 'Company with CR Number already exists' })

    // Handle file uploads to Azure Blob Storage
    let logoImageUrl = ''
    let crDocumentUrl = ''

    if (req.files && req.files['logoImage']) {
      logoImageUrl = await uploadToAzure(req.files['logoImage'][0])
    }
    if (req.files && req.files['crDocument']) {
      crDocumentUrl = await uploadToAzure(req.files['crDocument'][0])
    }

    const user = await createUser(email, password, 'company')
    if (!user) {
      return res.status(500).json({ error: 'User creation failed' })
    }

    const company = new Company({
      name,
      address,
      crNumber,
      phone,
      size,
      logoImage: logoImageUrl,
      crDocument: crDocumentUrl,
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
    return res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { signUp }
