const express = require("express")
const router = express.Router()
const usercontroller = require("../controllers/users")
const jwt = require("../middleware/jwt")

router.post("/signin", usercontroller.signIn)
router.get("/profile", jwt.verifyToken, usercontroller.profile)

module.exports = router
