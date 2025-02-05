const mongoose = require('mongoose')

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    crNumber: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    size: {
      type: String,
      required: true
    },
    logoImage: {
      type: String,
      required: true
    },
    crDocument: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['CR-rejected', 'CR-in-progress', 'active', 'Deleted']
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    timestamps: true
  }
)

Company = mongoose.model('Company', companySchema)

module.exports = User
