const EmployeeShift = require('../models/EmployeeShift')

const createEmployeeShift = async (req, res) => {
  try {
    let { startDate, endDate, employeeId, shiftId } = req.body
    const companyId = req.session.companyId
    if (!startDate || !employeeId || !shiftId) {
      return res.status(400).json({ error: 'Required fields are missing!' })
    }
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
    const foundEmployeesShfits = await EmployeeShift.find().populate(
      'shiftId',
      'name'
    )
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
    if (req.body.startDate) req.body.startDate = new Date(req.body.startDate)
    if (req.body.endDate) req.body.endDate = new Date(req.body.endDate)

    const updatedEmployeeShift = await EmployeeShift.findByIdAndUpdate(
      req.params.employeeShiftId,
      { $set: req.body },
      { new: true, runValidators: true }
    )

    // If no shift was found, return a 404 response
    if (!updatedEmployeeShift) {
      return res.status(404).json({ error: 'Employee shift not found!' })
    }
    res.status(200).json(updatedEmployeeShift)
  } catch (error) {
    console.error('Error updating employee shift:', error.message)
    res.status(500).json({ error: error.message })
  }
}

const deleteEmployeeShift = async (req, res) => {
  try {
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
