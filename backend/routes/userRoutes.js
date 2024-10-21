const express = require('express')
const { registerUser, loginUser, logoutUser, getUser, editUser } = require('../controllers/userController')
const { check } = require('express-validator') // validation
const router = express.Router() // directing requests

// register route
router.post(
    '/register-user',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please provide a valid email').isEmail(),
        check('password', 'Password must be 6 characters or more').isLength({ min: 6 })
    ],
    registerUser
)

// login
router.post('/login-user', loginUser)

// get user
router.get('/profile', getUser)

// edit user
router.put(
    '/user/edit', 
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please provide a valid email').isEmail(),
        check('password', 'Password must be 6 characters or more').isLength({ min: 6 })
    ],
    editUser
)

// logout
router.get('/logout', logoutUser)

module.exports = router