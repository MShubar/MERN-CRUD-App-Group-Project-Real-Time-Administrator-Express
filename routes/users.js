const express = require('express')
const router = express.Router()
const userController = require('../controllers/users')
const { verifyToken } = require('../middleware/jwt')

router.post('/signup', userController.signUp)
router.post('/signin', userController.signIn)
router.get('/profile', verifyToken, userController.profile)

module.exports = router
