const Employee = require('../models/Employee')
const User = require('../models/User')
const { createUser, updateUser } = require('./users')
const { signToken } = require('../middleware/jwt')
const { uploadToAzure } = require('./uploadToAzure')

const createEmployee = async (req, res) => {
  try {
    //console.log("req.body=======",req.body);

    const {
      name,
      image,
      position,
      companyId,
      departmentId,
      status,
      email,
      password
    } = req.body
    if (!name || !status || !email || !password) {
      // console.log("name=========>>>>",name);
      // console.log("status=========>>>>",status);
      // console.log("email=========>>>>",email);
      // console.log("password=========>>>>",password);

      return res.status(400).json({ error: 'Required fields are missing!' })
    }
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
    }
    // Handle file uploads to Azure Blob Storage
    let imageUrl = ''
    if (req.files && req.files['image']) {
      imageUrl = await uploadToAzure(req.files['image'][0])
    }
    const user = await createUser(email, password)
    //console.log("user=======",user);
    const employee = new Employee({
      name,
      image: imageUrl,
      position,
      companyId,
      departmentId,
      status,
      userId: [user._id]
    })
    await employee.save()
    const token = signToken(user)
    return res.status(201).json({
      message: 'Employee Created successfully',
      employee,
      token
    })
  } catch (error) {
    console.error('Error creating employee:', error.message)
    res.status(500).json({ error: error.message })
  }
}
const findAllEmployees = async (req, res) => {
  try {
    const companyId = req.user._id
    const user = req.user._id

    const currentUser = await User.findById(user)

    const foundEmployeesForEmployee = await Employee.find(currentUser.companyId)

    const foundEmployees = await Employee.find({ companyId })
    if (currentUser.role == 'employee') {
      res.status(200).json(foundEmployeesForEmployee)
    }
    if (currentUser.role == 'company') {
      res.status(200).json(foundEmployees)
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Getting all Employees', error: error.message })
  }
}
const showEmployee = async (req, res) => {
  try {
    // Find the employee by ID

    const foundEmployee = await Employee.findById(req.params.employeeId)
    //console.log("==foundEmployee========>>>",foundEmployee);

    if (!foundEmployee) {
      res.status(404)
      throw new Error('Employee Not Found!')
    }

    // Assuming the employee document has a userId field
    const userId = foundEmployee.userId // Adjust this if the field name is different

    // Retrieve the user's email and password from the users table
    const foundUser = await User.findById(userId) // Assuming User is your user model
    if (!foundUser) {
      res.status(404)
      throw new Error('User Not Found!')
    }

    // Combine employee data with user data
    const employeeWithUserDetails = {
      ...foundEmployee.toObject(), // Convert employee document to plain object
      email: foundUser.email
    }

    res.status(200).json(employeeWithUserDetails)
  } catch (error) {
    if (res.statusCode === 404) {
      res.json({ error: error.message })
    } else {
      res.status(500).json({ error: error.message })
    }
  }
}
const editEmployee = async (req, res) => {
  try {
    let imageUrl = ''
    if (req.files && req.files['image']) {
      imageUrl = await uploadToAzure(req.files['image'][0])
      req.body.image = imageUrl
    }
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.employeeId,
      req.body,
      { new: true }
    )
    if (updatedEmployee) {
      const updatedUser = await updateUser(
        req.body.email,
        req.body.password,
        updatedEmployee.userId,
        res
      )
      if (updatedUser) {
        res.status(200).json(updatedEmployee)
      }
    } else {
      res
        .status(500)
        .json({ message: 'Error updating employee', error: error.message })
    }
  } catch (error) {
    if (res.statusCode === 404) {
      res.json({ error: error.message })
    } else {
      res.status(500).json({ error: error.message })
    }
  }
}
const deleteEmployee = async (req, res) => {
  try {
    // Find the Employee to be deleted
    const deletedEmployee = await Employee.findById(req.params.employeeId)
    console.log('deletedEmployee============>', deletedEmployee)
    if (!deletedEmployee) {
      res.status(404)
      throw new Error('Employee not found :(')
    }
    let userId = deletedEmployee.userId
    await User.findByIdAndDelete(userId)
    await Employee.findByIdAndDelete(req.params.employeeId)
    res.status(200).json({
      message: `Successfully Deleted Employee with the ID of ${req.params.employeeId}`
    })
  } catch (error) {
    console.error('Error deleting Employee:', error.message)
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  createEmployee,
  findAllEmployees,
  showEmployee,
  editEmployee,
  deleteEmployee
}
