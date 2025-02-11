const mongoose = require('mongoose')
const shiftSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company'
        }
    },
    {
        timestamps: true
    }
)

const Shift = mongoose.model('Shift', shiftSchema)

module.exports = Shift