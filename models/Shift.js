const mongoose = require('mongoose')

const shiftSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company'
    }
  },
  {
    timestamps: true
  }
)

shiftSchema.pre('save', function (next) {
  if (this.startTime && typeof this.startTime === 'object') {
    this.startTime = this.startTime.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  if (this.endTime && typeof this.endTime === 'object') {
    this.endTime = this.endTime.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  next()
})

const Shift = mongoose.model('Shift', shiftSchema)

module.exports = Shift
