const express = require("express")
const router = express.Router()
const companyController = require("../controllers/companies")
const usercontroller = require("../controllers/users")

router.post("/signup", usercontroller.createUser, companyController.signUp)

module.exports = router
