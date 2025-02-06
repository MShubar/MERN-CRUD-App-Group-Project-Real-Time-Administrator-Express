const express = require('express')
const router = express.Router()
const companyController = require('../controllers/companies')

router.post('/signup', companyController.signUp)

module.exports = router
