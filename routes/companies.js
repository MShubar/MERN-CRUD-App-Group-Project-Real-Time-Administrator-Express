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
router.get('/:companyId', companyController.showCompany)
router.put(
  '/:companyId',
  upload.fields([{ name: 'logoImage' }, { name: 'crDocument' }]),
  companyController.editCompany
)
router.get('/check/:companyId', companyController.deleteCompany)

module.exports = router
