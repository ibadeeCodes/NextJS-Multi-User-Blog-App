const path = require('path')
const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const colors = require('colors')
const cors = require('cors')
const connectDB = require('./config/db')

// app
const app = express()

// Set static folder
app.use('/api', express.static(path.join(__dirname, 'public')))

// middlewares
app.use(express.json()) // express built-in bodyParser
app.use(cookieParser())

// env vars.
require('dotenv').config({ path: './config/config.env' })

// db connection
connectDB()

//cors
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
  app.use(cors())
}

//Mount routers
app.use('/api/auth', require('./routes/auth'))
app.use('/api/user', require('./routes/user'))
app.use('/api', require('./routes/category'))
app.use('/api', require('./routes/tag'))
app.use('/api', require('./routes/blog'))

const PORT = process.env.PORT || 8000

// server activation
app.listen(PORT, () => {
  console.log(`server started at PORT : ${PORT}`)
})
