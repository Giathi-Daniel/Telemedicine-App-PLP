const express = require('express')
const { registerProvider, loginProvider, logoutProvider, getProvider, editProvider } = require('../controllers/providerController')
const { check } = require('express-validator') // validation
const router = express.Router() // directing requests

// register route
router.post(
    '/register',
    [
        check('first_name', 'Last is required').not().isEmpty(),
        check('last_name', 'Last Name is required').not().isEmpty(),
        check('email', 'Please provide a valid email').isEmail(),
        check('provider_specialty', 'Specialty required').not().isEmpty(),
        check('phone_number', 'Phone number required').not().isEmpty(),
        check('password', 'Password must be 6 characters or more').isLength({ min: 6 })
    ],
    registerProvider
)

// login
router.post('/login', loginProvider)

// get user
router.get('/profile', getProvider)

// edit user
router.put(
    '/edit', 
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please provide a valid email').isEmail(),
        check('password', 'Password must be 6 characters or more').isLength({ min: 6 })
    ],
    editProvider
)

// logout
router.get('/logout', logoutProvider)

module.exports = router