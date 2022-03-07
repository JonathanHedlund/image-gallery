const express = require('express')
const path = require('path')
const dotenv = require('dotenv').config()

const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')

const port = process.env.port || 5000

connectDB()

// Initialize express
const app = express()

// Parse incoming requests
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Set static folder
app.use(express.static(path.join(__dirname, '../public')))

// Get express routes
app.use('/api/images', require('./routes/imageRoutes'))
app.use('/api/users', require('./routes/userRoutes'))

//Error handler middleware
app.use(errorHandler)

//Listen to port
app.listen(port, () => console.log(`Server started on port ${port}`))