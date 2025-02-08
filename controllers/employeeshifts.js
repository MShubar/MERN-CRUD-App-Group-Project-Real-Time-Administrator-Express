const  EmployeeShift= require('../models/EmployeeShift')
const createEmployeeShift = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      employeeId,
      companyId
    } = req.body
    //companyId= req.user._id
    if (
      !startDate || !endDate || !employeeId|| !companyId
    ) {
      return res.status(400).json({ error: 'Required fields are missing!' })
    }
    const employeeShift = new EmployeeShift({
      startDate,
      endDate,
      employeeId,
      companyId
      //companyId: [companyId]
        })
        await employeeShift.save()
        return res.status(201).json({
          message: 'Shift assigned to employee successfully',
          employeeShift
        })
  } catch (error) {
    res.status(500).json({ error: error.message });
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
module.exports = {createEmployeeShift,findAllEmployeesShfits}