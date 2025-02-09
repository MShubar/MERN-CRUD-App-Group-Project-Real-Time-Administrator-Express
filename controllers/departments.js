// const Department = require('../models/Department')
// const express = require('express')

// //DOUBLE CHECK THIS
// const createDepartment = async (req,res) => {
//     try{
//         const companyId  = req.session.userId
//         const newDepartment = await Department.create(req.body, companyId)
//         res.status(201).json(newDepartment)
//     } catch (error) {
//         res.status(500).json({ error: error.message})
//     }
// }

// const indexDepartment = async (req, res) => {
//     try{
//         const index = await Department.find()
//         res.status(200).json(index)
//     } catch(error) {
//         res.status(500).json({message: 'Retrieving all Departments', error: error.message})
//     }
// }

// const showDepartment = async (req, res) => {
//     try{
//         const foundDepartment = await Department.findById(req.params.departmentId)
//         if(!foundDepartment){
//             res.status(404)
//             throw new Error('Department Not Found.')
//         }
//         res.status(200).json(foundDepartment)
//     } catch (error) {
//     if (res.statusCode === 404) {
//       res.json({ error: error.message })
//     } else {
//       res.status(500).json({ error: error.message })
//     }
//   }
// }

// const editDepartment = async (req, res) => {
//     try {

//     }
// }



//NEW

const Department = require('../models/Department')
const express = require('express')

const createDepartment = async (req, res) => {
  console.log('Request body:', req.body)
  try {
    const { name, description } = req.body
    const companyId = req.session.companyId 
    const newDepartment = await Department.create({
      name,
      description,
      companyId
    })
    res.status(201).json(newDepartment)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const findAllDepartments = async (req, res) => {
  try {
    const companyId = req.session.companyId 
    const foundDepartments = await Department.find({ companyId })
    res.status(200).json(foundDepartments)
  } catch (error) {
    res.status(500).json({ message: 'Getting all departments', error: error.message })
  }
}

const showDepartment = async (req, res) => {
  try {
    const companyId = req.session.companyId 
    const foundDepartment = await Department.findOne({
      _id: req.params.departmentId,
      companyId 
    })
    if (!foundDepartment) {
      res.status(404)
      throw new Error('Department Not Found!')
    }
    res.status(200).json(foundDepartment)
  } catch (error) {
    if (res.statusCode === 404) {
      res.json({ error: error.message })
    } else {
      res.status(500).json({ error: error.message })
    }
  }
}

const editDepartment = async (req, res) => {
  try {
    const companyId = req.session.companyId 
    const updatedDepartment = await Department.findOneAndUpdate(
      { _id: req.params.departmentId, companyId },
      req.body,
      { new: true }
    )
    if (!updatedDepartment) {
      res.status(404)
      throw new Error('Department Not Found!')
    }
    res.status(200).json(updatedDepartment)
  } catch (error) {
    if (res.statusCode === 404) {
      res.json({ error: error.message })
    } else {
      res.status(500).json({ error: error.message })
    }
  }
}

const deleteDepartment = async (req, res) => {
  try {
    const companyId = req.session.companyId 
    const deletedDepartment = await Department.findOneAndDelete({
      _id: req.params.departmentId,
      companyId
    })
    res.status(200).json({
      message: `Successfully Deleted Department with the ID of ${req.params.departmentId}`
    })
  } catch (error) {
    if (res.statusCode === 404) {
      res.json({ error: error.message })
    } else {
      res.status(500).json({ error: error.message })
    }
  }
}

module.exports = {
  createDepartment,
  findAllDepartments,
  showDepartment,
  editDepartment,
  deleteDepartment
}
