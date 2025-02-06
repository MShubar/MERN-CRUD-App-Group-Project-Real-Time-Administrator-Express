const Company = require("../models/Company")
const { signToken } = require("../middleware/jwt")
const { createUser } = require("./users")

const signUp = async (req, res) => {
  try {
    const { name, address, crNumber, phone, size, logoImage, crDocument } =
      req.body
    if (!name || !crNumber) {
      return res.status(400).json({ error: "Missing required fields." })
    }

    const newCompany = await Company.create({
      name,
      address,
      crNumber,
      phone,
      size,
      logoImage,
      crDocument,
      userId: req.user._id,
      status: "CR-in-progress",
    })

    const token = signToken(req.user)
    return res.status(201).json({
      message: "Company created successfully.",
      token,
      company: newCompany,
      user: req.user,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Something went wrong!" })
  }
}

module.exports = { signUp }
