// import neccessary packages
const db = require('./config/db') // database conn
const express = require('express') // web server
const bodyParser = require('body-parser') // capture form data
const session = require('express-session') // session-management
const MySQLStore = require('express-mysql-session')('session') // session-management storage
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
    saveuninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 // 1 hour

    }
}))

app.listen(3000, console.log('Server running'))