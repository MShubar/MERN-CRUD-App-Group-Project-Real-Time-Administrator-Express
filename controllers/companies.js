const Company = require('../models/Company')
const User = require('../models/User')
const Department = require('../models/Department')
const Employee = require('../models/Employee')
const Shift = require('../models/Shift')
const EmployeeShift = require('../models/EmployeeShift')
const { createUser,updateUser } = require('./users')
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
const showCompany = async (req, res) => {
  try {
    // Find the employee by ID

    const foundCompany = await Company.findOne({ userId: { $in: [req.params.companyId] } });
   // console.log("==foundEmployee========>>>",foundCompany);
    
    if (!foundCompany) {
      res.status(404)
      throw new Error('Company Not Found!')
    }

    const userId = foundCompany.userId 

    // Retrieve the user's email and password from the users table
    const foundUser = await User.findById(userId) // Assuming User is your user model
    if (!foundUser) {
      res.status(404)
      throw new Error('User Not Found!')
    }

    // Combine employee data with user data
    const companyWithUserDetails = {
      ...foundCompany.toObject(), // Convert employee document to plain object
      email: foundUser.email
    }

    res.status(200).json(companyWithUserDetails)
  } catch (error) {
    if (res.statusCode === 404) {
      res.json({ error: error.message })
    } else {
      res.status(500).json({ error: error.message })
    }
  }
}
const editCompany = async (req, res) => {
  try {
   // console.log('Request Body:', req.body)

   console.log('Request req.params.companyId:', req.params.companyId)
   //console.log('Request User:', req.user)

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

    // const existingUser = await User.findOne({ email })
    // if (existingUser)
    //   return res.status(400).json({ error: 'User already exists' })

    // const existingCR = await Company.findOne({ crNumber })
    // if (existingCR)
    //   return res
    //     .status(400)
    //     .json({ error: 'Company with CR Number already exists' })

    // Handle file uploads to Azure Blob Storage
    let logoImageUrl = ''
    let crDocumentUrl = ''
    
    
    if (req.files && req.files['logoImage']) {
      logoImageUrl = await uploadToAzure(req.files['logoImage'][0])
      req.body.logoImage = logoImageUrl
    }
    if (req.files && req.files['crDocument']) {
      crDocumentUrl = await uploadToAzure(req.files['crDocument'][0])
      req.body.crDocument = crDocumentUrl
    }

    // const updatedCompany = await Company.findByIdAndUpdate(
    //   req.params.companyId,
    //   req.body,
    //   { new: true }
    // )
//     const updateData = {
//       ...req.body,
//       logoImage: logoImageUrl,  // Add logoImage URL
//       crDocument: crDocumentUrl, // Add CR Document URL
//     };
// console.log("=====updateData====>>>",updateData);

    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.companyId,
      req.body,
      { new: true }
    );
    console.log("=====updatedCompany=====>>",updatedCompany);
    
    if (updatedCompany) {
      const updatedUser = await updateUser(
        req.body.email,
        req.body.password,
        updatedCompany.userId,
        res
      )
      if (updatedUser) {
        res.status(200).json(updatedCompany)
      }
    } else {
      res
        .status(500)
        .json({ message: 'Error updating Company', error: error.message })
    }
  } catch (error) {
    if (res.statusCode === 404) {
      res.json({ error: error.message })
    } else {
      res.status(500).json({ error: error.message })
    }
  }
}
const findCompanies = async (req, res) => {// to display the company logo in the navbar
  try {
    console.log('Company ID===========================>>>>>:')
    const companyId = req.user
    console.log('Company ID===========================>>>>>:', companyId)

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
const deleteCompany = async (req, res) => {
  //try {
    // Find the Employee to be deleted
const currentUser= req.user._id
console.log("==========currentUser=====",currentUser);

  //   const deletedShift= await Shift.findById({})
  //   const deletedCompany= await Company.findById(req.params.companyId)
  //   const deletedCompany= await Company.findById(req.params.companyId)
  //   const deletedCompany= await Company.findById(req.params.companyId)
  //   //console.log('deletedCompany============>', deletedCompany)
  //   if (!deletedCompany) {
  //     res.status(404)
  //     throw new Error('Company not found :(')
  //   }
  //   //let userId = deletedCompany.userId
  //   await User.findByIdAndDelete(userId)
  //   await Employee.findByIdAndDelete(req.params.employeeId)
  //   res.status(200).json({
  //     message: `Successfully Deleted Employee with the ID of ${req.params.employeeId}`
  //   })
  // } catch (error) {
  //   console.error('Error deleting Employee:', error.message)
  //   res.status(500).json({ error: error.message })
  // }
}
module.exports = { signUp, findCompanies, showCompany, editCompany, deleteCompany }
