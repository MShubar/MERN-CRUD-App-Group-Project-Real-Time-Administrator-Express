const Employee = require('../models/Employee')
const express = require('express')
const { createUser } = require('./users');
////////////////////This function is not yet well structured//////////////////
const createEmployee = async (req, res) => {
  //console.log('Request body:', req.body)
  try {
    req.body.companyId= req.user._id // gitting the current logged in company user id
    const { email, password,  ...rest } = req.body // extract the email and password to be added as a new user in the users table first 
    const newUser= await createUser({email, password})
    if(newUser){
      const newEmployee = await Employee.create({
        rest // Adding the rest of the employee information to the employee table
      })
      res.status(201).json(newEmployee)
    }
    else{
      res
      .status(500)
      .json({ message: 'Error adding new user', error: error.message })
    }
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
const showEmployee = async (req, res) => {
  try {
    const foundEmployee = await Employee.findById(
      req.params.employeeId
    )
    if (!foundEmployee) {
      res.status(404)
      throw new Error('Employee Not Found!')
    }
    res.status(200).json(foundEmployee)
  } catch (error) {
    if (res.statusCode === 404) {
      res.json({ error: error.message })
    } else {
      res.status(500).json({ error: error.message })
    }
  }
}
const editEmployee = async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.employeeId,
      req.body,
      { new: true }
    )
    if(updatedEmployee){
      res.status(200).json(updatedEmployee)
    }else{
      res
      .status(500)
      .json({ message: 'Error updating employee', error: error.message })
    }
  }catch(error){
    if (res.statusCode === 404) {
      res.json({ error: error.message })
    } else {
      res.status(500).json({ error: error.message })
    }
  }
}
const deleteEmployee = async (req, res) => {
  try {
    // Find the Employee to be deleted
    await Employee.findByIdAndDelete(req.params.employeeId)
    res.status(200).json({
      message: `Successfully Deleted Employee with the ID of ${req.params.employeeId}`
    })
  } catch (error) {
    console.error('Error deleting Employee:', error.message)
    res.status(500).json({ error: error.message })
  }
}


module.exports = {createEmployee,findAllEmployees,showEmployee,editEmployee,deleteEmployee}