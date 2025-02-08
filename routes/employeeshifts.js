const express = require('express')
const router = express.Router()
const employeeShiftsController = require('../controllers/employeeshifts')
const { verifyToken } = require('../middleware/jwt')
router.post('/new', verifyToken, employeeShiftsController.createEmployeeShift)
router.get('/', verifyToken, employeeShiftsController.findAllEmployeesShfits)
module.exports = router