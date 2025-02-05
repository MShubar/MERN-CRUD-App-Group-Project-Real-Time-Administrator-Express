const express = require('express')
const router = express.Router()
const companyController = require('../controllers/company')
const { verifyToken } = require('../middleware/jwt')

router.post('/create', companyController.create)
router.get('/index', userController.index)
router.get('/show', userController.show)

module.exports = router
