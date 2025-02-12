const mongoose = require('mongoose')
const employee_shiftSchema = new mongoose.Schema(
  {
    startDate: {
      type: Date,
      required: true,
      set: (date) => new Date(date.setUTCHours(0, 0, 0, 0)),
      get: (date) => date.toISOString().split('T')[0]
    },
    endDate: {
      type: Date,
      required: true,
      set: (date) => new Date(date.setUTCHours(0, 0, 0, 0)),
      get: (date) => date.toISOString().split('T')[0]
    },
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    shiftId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shift' }
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true }
  }
)

const Employee_Shift = mongoose.model('Employee_Shift', employee_shiftSchema)

module.exports = Employee_Shift
