const express = require('express')
const route = express.Router()
const departmentController = require('../controllers/departments')
const { verifyToken } = require('../middleware/jwt')

route.post('/', verifyToken, departmentController.createDepartment)
route.get('/', verifyToken, departmentController.findAllDepartments)
route.get('/:departmentId', verifyToken, departmentController.showDepartment)
route.put('/:departmentId', verifyToken, departmentController.editDepartment)
route.delete('/:departmentId', verifyToken, departmentController.deleteDepartment)

module.exports = route 
