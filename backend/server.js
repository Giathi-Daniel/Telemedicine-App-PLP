// import neccessary packages
const db = require('./config/db') // database conn
const express = require('express') // web server
const bodyParser = require('body-parser') // capture form data
const session = require('express-session');  // session-management
const MySQLStore = require('express-mysql-session')(session); // session-management storage
require('dotenv').config() // manage environment variables

const app = express()

// middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // capture form data

// sesssion store
const sessionStore = new MySQLStore({}, db)

// configure session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 // 1 hour
    }
}))

// routes
// app.use('/telemedicine/api/users', require('./routes/userRoutes'))

const PORT =  process.env.PORT || 3200

// start server
app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`)
})