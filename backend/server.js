const db = require('./config/db')
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')('session')
require('dotenv').config()

const app = express()

// middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // capture form data

app.listen(3000, console.log('Server running'))