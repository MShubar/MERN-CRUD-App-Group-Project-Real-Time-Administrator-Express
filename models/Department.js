const mongoose = require('mongoose')
const departmentSchema = new mongoose.Schema(
    {
        name: {type: String, required: true}, 
        description: {type: String},
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company'
        }
    },
    {
        timestamps: true
    }
)

const Department = mongoose.model('Department', departmentSchema)

module.exports = Department