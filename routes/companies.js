const express = require('express')
const router = express.Router()
const companyController = require('../controllers/companies')
const upload = require('../middleware/multerConfig')

router.post(
  '/signup',
  upload.fields([{ name: 'logoImage' }, { name: 'crDocument' }]),
  companyController.signUp
)
router.get('/', companyController.findCompanies)

module.exports = router
