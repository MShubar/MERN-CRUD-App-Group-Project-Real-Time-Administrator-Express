const express = require('express')
const app = express()
const session = require('express-session')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
const morgan = require('morgan')
const methodOverride = require('method-override')
const PORT = process.env.PORT

// require paths
const userRouter = require('./routes/users')
const companyRouter = require('./routes/companies')
const employeeRouter = require('./routes/employees')
const employeeShiftsRouter = require('./routes/employeeshifts')

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(morgan('dev'))
app.use(methodOverride('_method'))
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: true
  })
)
//routers usage
app.set('view engine', 'ejs')

mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
  console.log(`Connection to MongoDB ${mongoose.connection.name}`)
})
app.use('/users', userRouter)
app.use('/companies', companyRouter)
app.use('/employees', employeeRouter)
app.use('/employeeshifts', employeeShiftsRouter)

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
