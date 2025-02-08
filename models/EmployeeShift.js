const mongoose = require('mongoose')
const employee_shiftSchema = new mongoose.Schema(
  {
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: () => {
        const date = new Date();
        date.setMonth(date.getMonth() + 1); // Add one month AI code
        return date;
      } },
    employeeId: { type: mongoose.Schema.Types.ObjectId,
          ref: 'Employee' },
    companyId: { type: mongoose.Schema.Types.ObjectId,
          ref: 'Company' },
  },
  {
    timestamps: true
  }
)

const Employee_Shif = mongoose.model('Employee_Shif', employee_shiftSchema)

module.exports = Employee_Shif
