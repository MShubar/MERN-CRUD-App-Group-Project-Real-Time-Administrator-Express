const Employee = require('../models/Employee')
const { createUser } = require('./users');
const { signToken } = require('../middleware/jwt') // Ensure this is correctly imported

const createEmployee = async (req, res) => {
  try {
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

    if (
      !name || !status || !email|| !password
    ) {
      return res.status(400).json({ error: 'Required fields are missing!' })
    }
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
    }
    const user = await createUser(email, password)
        const employee = new Employee({
          name,
          image,
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
          employee,token
        })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const findAllEmployees = async (req, res) => {
  try {
    const foundEmployees = await Employee.find()
    res.status(200).json(foundEmployees)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Getting all Employees', error: error.message })
  }
}
const showEmployee = async (req, res) => {
  try {
    const foundEmployee = await Employee.findById(
      req.params.employeeId
    )
    if (!foundEmployee) {
      res.status(404)
      throw new Error('Employee Not Found!')
    }
    res.status(200).json(foundEmployee)
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
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.employeeId,
      req.body,
      { new: true }
    )
    if(updatedEmployee){
      res.status(200).json(updatedEmployee)
    }else{
      res
      .status(500)
      .json({ message: 'Error updating employee', error: error.message })
    }
  }catch(error){
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
    await Employee.findByIdAndDelete(req.params.employeeId)
    res.status(200).json({
      message: `Successfully Deleted Employee with the ID of ${req.params.employeeId}`
    })
  } catch (error) {
    console.error('Error deleting Employee:', error.message)
    res.status(500).json({ error: error.message })
  }
}


module.exports = {createEmployee,findAllEmployees,showEmployee,editEmployee,deleteEmployee}