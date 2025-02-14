const EmployeeShift = require('../models/EmployeeShift')

const createEmployeeShift = async (req, res) => {
  try {
    let { startDate, endDate, employeeId, companyId, shiftId } = req.body

    if (!startDate || !endDate || !employeeId || !companyId || !shiftId) {
      return res.status(400).json({ error: 'Required fields are missing!' })
    }

    // Convert startDate and endDate to Date objects
    startDate = new Date(startDate)
    endDate = new Date(endDate)

    if (isNaN(startDate) || isNaN(endDate)) {
      return res.status(400).json({ error: 'Invalid date format!' })
    }

    const employeeShift = new EmployeeShift({
      startDate,
      endDate,
      employeeId,
      companyId,
      shiftId
    })

    await employeeShift.save()
    return res.status(201).json({
      message: 'Shift assigned to employee successfully',
      employeeShift
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const findAllEmployeesShfits = async (req, res) => {
  try {
    const foundEmployeesShfits = await EmployeeShift.find()
    res.status(200).json(foundEmployeesShfits)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Getting all Employees Shifts', error: error.message })
  }
}
const showEmployeeShift = async (req, res) => {
  try {
    const foundEmployeeShift = await EmployeeShift.findById(
      req.params.employeeShiftId
    )
    if (!foundEmployeeShift) {
      res.status(404)
      throw new Error('Employee Shift Not Found!')
    }
    res.status(200).json(foundEmployeeShift)
  } catch (error) {
    if (res.statusCode === 404) {
      res.json({ error: error.message })
    } else {
      res.status(500).json({ error: error.message })
    }
  }
}
const editEmployeeShift = async (req, res) => {
  try {
    const updatedEmployeeShift = await EmployeeShift.findByIdAndUpdate(
      req.params.employeeShiftId,
      req.body,
      { new: true }
    )
    if (updatedEmployeeShift) {
      res.status(200).json(updatedEmployeeShift)
    } else {
      res.status(500).json({
        message: 'Error updating employee shift',
        error: error.message
      })
    }
  } catch (error) {
    if (res.statusCode === 404) {
      res.json({ error: error.message })
    } else {
      res.status(500).json({ error: error.message })
    }
  }
}
const deleteEmployeeShift = async (req, res) => {
  try {
    // Find the Employee to be deleted
    await EmployeeShift.findByIdAndDelete(req.params.employeeShiftId)
    res.status(200).json({
      message: `Successfully Deleted Employee Shift with the ID of ${req.params.employeeShiftId}`
    })
  } catch (error) {
    console.error('Error deleting Employee Shift:', error.message)
    res.status(500).json({ error: error.message })
  }
}
module.exports = {
  createEmployeeShift,
  findAllEmployeesShfits,
  showEmployeeShift,
  editEmployeeShift,
  deleteEmployeeShift
}
