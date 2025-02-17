const express = require('express')
const router = express.Router()
const userController = require('../controllers/users')
const jwt = require('../middleware/jwt')

router.post('/signin', userController.signIn)
router.get('/profile', jwt.verifyToken, userController.profile)
router.put('/:userId', userController.updateUser)
module.exports = router
