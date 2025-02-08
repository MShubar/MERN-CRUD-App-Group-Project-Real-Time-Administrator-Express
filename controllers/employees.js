const Employee = require('../models/Employee')
const User = require('../models/User')
const express = require('express')
const { createUser } = require('./users');
////////////////////This function is not yet well structured//////////////////
const createEmployee = async (req, res) => {
  //console.log('Request body:', req.body)
  try {
    const { email, password,  ...rest } = req.body
    const newUser= await User.createUser({'email':email,'password':password})
    const newEmployee = await Employee.create({
      rest // Spread the rest of the values
    })
    res.status(201).json(newEmployee)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
const findAllEmployees = async (req, res) => {
  try {
    const foundEmployees = await Employee.find()
    res.status(200).json(foundEmployees)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Getting all Employees', error: error.message })
  }
}





module.exports = {createEmployee,findAllEmployees}