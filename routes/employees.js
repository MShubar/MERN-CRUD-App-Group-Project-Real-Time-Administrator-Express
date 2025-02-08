const express = require('express')
const router = express.Router()
const employeeController = require('../controllers/employees')
const { verifyToken } = require('../middleware/jwt')

route.post('/', verifyToken, employeeController.createEmployee)
route.get('/', verifyToken, employeeController.findAllEmployees)
route.get('/:employeeId', verifyToken, employeeController.showEmployee)
route.put('/:employeeId', verifyToken, employeeController.editEmployee)
route.delete(
  '/:employeeId',
  verifyToken,
  employeeController.deleteEmployee
)

module.exports = router
