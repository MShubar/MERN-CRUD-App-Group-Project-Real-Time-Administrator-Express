const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['company', 'employee'],
      default: 'employee'
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company', // Assuming there's a Company model
      required: function () {
        return this.role === 'company'
      } // Only required if role is 'company'
    }
  },
  {
    timestamps: true
  }
)

User = mongoose.model('User', userSchema)

module.exports = User
