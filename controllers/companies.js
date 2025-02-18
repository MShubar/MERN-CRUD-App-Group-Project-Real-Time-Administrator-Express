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

    // Create the company first
    const company = new Company({
      name,
      address,
      crNumber,
      phone,
      size,
      logoImage: logoImageUrl,
      crDocument: crDocumentUrl,
      status: 'CR-in-progress'
    })

    await company.save()

    // Now create the user with companyId
    const user = await createUser(email, password, 'company', company._id)
    if (!user) {
      return res.status(500).json({ error: 'User creation failed' })
    }

    // Assign user to company
    company.userId.push(user._id)
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

const findCompanies = async (req, res) => {
  try {
    const companyId = req.user

    const foundCompanies = await Company.findOne(companyId)

    if (foundCompanies.length === 0) {
      return res.status(404).json({ message: 'No companies found' })
    }

    console.log('Found Companies:', foundCompanies)
    return res.status(200).json(foundCompanies) // Only send response after validation
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error retrieving companies', error: error.message })
  }
}

module.exports = { signUp, findCompanies }
