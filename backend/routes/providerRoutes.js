const express = require('express');
const { checkRole } = require('../middleware/roleMiddleware');
const { registerProvider, loginProvider, logoutProvider, getProvider, editProvider } = require('../controllers/providerController');
const { check } = require('express-validator'); // validation
const router = express.Router(); // directing requests

// Register provider route
router.post(
    '/register',
    [
        checkRole('admin'), // Only admins should register providers
        check('first_name', 'First name is required').not().isEmpty(),
        check('last_name', 'Last name is required').not().isEmpty(),
        check('email', 'Please provide a valid email').isEmail(),
        check('provider_specialty', 'Specialty is required').not().isEmpty(),
        check('phone_number', 'Phone number is required').not().isEmpty(),
        check('password', 'Password must be 6 characters or more').isLength({ min: 6 })
    ],
    registerProvider
);

router.post('/login', loginProvider);

// Only providers can access their profile
router.get('/profile', checkRole('provider'), getProvider);

// Edit provider details
router.put(
    '/edit',
    [
        checkRole('provider'),
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please provide a valid email').isEmail(),
        check('password', 'Password must be 6 characters or more').isLength({ min: 6 })
    ],
    editProvider
);

router.get('/logout', checkRole('provider'), logoutProvider);

module.exports = router;
