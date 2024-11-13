const express = require('express');
const { checkRole } = require('../middleware/roleMiddleware');
const { registerUser, loginUser, logoutUser, getUser, editUser, profilePatient } = require('../controllers/patientController');
const { check } = require('express-validator'); // validation
const router = express.Router(); // directing requests

router.post(
    '/register',
    [
        check('first_name', 'First name is required').not().isEmpty(),
        check('last_name', 'Last name is required').not().isEmpty(),
        check('email', 'Please provide a valid email').isEmail(),
        check('date_of_birth', 'Date of birth is required').not().isEmpty(),
        check('password', 'Password must be 6 characters or more').isLength({ min: 6 })
    ],
    registerUser
);

router.post('/login', loginUser);

// Only patients should access their profile
router.get('/profile', checkRole('patient'), getUser);

// Edit patient details
router.put(
    '/edit', [
        checkRole('patient'),
        check('first_name', 'First name is required').not().isEmpty(),
        check('last_name', 'Last name is required').not().isEmpty(),
        check('email', 'Please provide a valid email').isEmail(),
        check('password', 'Password must be 6 characters or more').isLength({ min: 6 })
    ], 
    editUser
);

router.get('/logout', checkRole('patient'), logoutUser);
router.get('/view-profile', profilePatient);

module.exports = router;
