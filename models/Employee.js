const mongoose = require('mongoose')
const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
    position: { type: String },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'blocked'],
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    departmentId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Department' }]
  },
  {
    timestamps: true
  }
)

const Employee = mongoose.model('Employee', employeeSchema)

module.exports = Employee
