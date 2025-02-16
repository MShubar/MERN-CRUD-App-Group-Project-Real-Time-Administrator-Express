const express = require('express')
const router = express.Router()
const employeeController = require('../controllers/employees')
const { verifyToken } = require('../middleware/jwt')
const upload = require('../middleware/multerConfig')

router.post('/new', upload.fields([{ name: 'image' }]),
  employeeController.createEmployee
)

//router.post('/new', employeeController.createEmployee)
// router.post('/new',  (req, res, next) => {
//   console.log('POST request received:', req.body);
//   next();
// }, employeeController.createEmployee);
router.get('/', verifyToken, employeeController.findAllEmployees)
router.get('/:employeeId', verifyToken, employeeController.showEmployee)
router.put('/:employeeId', upload.fields([{ name: 'image' }]), employeeController.editEmployee)
router.delete('/:employeeId', verifyToken, employeeController.deleteEmployee)

module.exports = router
