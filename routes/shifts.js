const express = require('express')
const route = express.Router()
const shiftController = require('../controllers/shifts')
const { verifyToken } = require('../middleware/jwt')

route.post('/', verifyToken, shiftController.createShift)
route.get('/', verifyToken, shiftController.findAllShifts)
route.get('/:shiftId', verifyToken, shiftController.showShift)
route.put('/:shiftId', verifyToken, shiftController.editShift)
route.delete('/:shiftId', verifyToken, shiftController.deleteShift)

module.exports = route 
