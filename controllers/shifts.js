const Shift = require('../models/Shift')
const express = require('express')

const createShift = async (req, res) => {
  console.log('Request body:', req.body)
  try {
    const { name, startTime, endTime } = req.body
    const companyId = req.session.companyId 
    const newShift = await Shift.create({
      name,
      startTime,
      endTime,
      companyId
    })
    res.status(201).json(newShift)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const findAllShifts = async (req, res) => {
  try {
    const companyId = req.session.companyId 
    const foundShifts = await Shift.find({ companyId })
    res.status(200).json(foundShifts)
  } catch (error) {
    res.status(500).json({ message: 'Getting all shifts', error: error.message })
  }
}

const showShift = async (req, res) => {
  try {
    const companyId = req.session.companyId 
    const foundShift = await Shift.findOne({
      _id: req.params.shiftId,
      companyId 
    })
    if (!foundShift) {
      res.status(404)
      throw new Error('Shift Not Found!')
    }
    res.status(200).json(foundShift)
  } catch (error) {
    if (res.statusCode === 404) {
      res.json({ error: error.message })
    } else {
      res.status(500).json({ error: error.message })
    }
  }
}

const editShift = async (req, res) => {
  try {
    const companyId = req.session.companyId 
    const updatedShift = await Shift.findOneAndUpdate(
      { _id: req.params.shiftId, companyId },
      req.body,
      { new: true }
    )
    if (!updatedShift) {
      res.status(404)
      throw new Error('Shift Not Found!')
    }
    res.status(200).json(updatedShift)
  } catch (error) {
    if (res.statusCode === 404) {
      res.json({ error: error.message })
    } else {
      res.status(500).json({ error: error.message })
    }
  }
}

const deleteShift = async (req, res) => {
  try {
    const companyId = req.session.companyId 
    const deletedShift = await Shift.findOneAndDelete({
      _id: req.params.shiftId,
      companyId
    })
    res.status(200).json({
      message: `Successfully Deleted Shift with the ID of ${req.params.shiftId}`
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
  createShift,
  findAllShifts,
  showShift,
  editShift,
  deleteShift
}
