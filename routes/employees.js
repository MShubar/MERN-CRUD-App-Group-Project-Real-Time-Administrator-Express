const express = require('express')
const router = express.Router()
const employeeController = require('../controllers/employees')
const { verifyToken } = require('../middleware/jwt')

router.post('/', verifyToken, employeeController.createEmployee)
router.get('/', verifyToken, employeeController.findAllEmployees)
router.get('/:employeeId', verifyToken, employeeController.showEmployee)
router.put('/:employeeId', verifyToken, employeeController.editEmployee)
router.delete('/:employeeId', verifyToken, employeeController.deleteEmployee)

module.exports = router
