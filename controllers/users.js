const User = require("../models/User")
const bcrypt = require("bcrypt")
const { signToken } = require("../middleware/jwt")

const createUser = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: "Missing required fields." })
    }

    const userExist = await User.findOne({ email })
    if (userExist) {
      return res.status(409).json({ error: "Email already taken." })
    }

    const hashedPassword = bcrypt.hashSync(password, +process.env.SALT)

    const newUser = await User.create({
      email,
      password: hashedPassword,
      role: "company",
    })

    req.user = newUser
    next()
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Something went wrong!" })
  }
}

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: "Missing required fields." })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password." })
    }

    const matched = bcrypt.compareSync(password, user.password)
    if (!matched) {
      return res.status(400).json({ error: "Invalid email or password." })
    }

    const token = signToken(user)
    return res.status(200).json({ message: "Login successful.", token, user })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Something went wrong!" })
  }
}

const profile = async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(400).json({ error: "No user found or token is invalid." })
  }
  try {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ error: "User not found." })
    return res.status(200).json(user)
  } catch (error) {
    console.error("Error in profile route:", error)
    res.status(500).json({ error: "Something went wrong!" })
  }
}

module.exports = { createUser, signIn, profile }
