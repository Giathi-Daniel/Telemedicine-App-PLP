const express = require('express');
const { checkRole } = require('../middleware/roleMiddleware');
const { registerAdmin, loginAdmin, logoutAdmin, getAdmin, editAdmin } = require('../controllers/adminController');
const { check } = require('express-validator'); // validation
const router = express.Router(); // directing requests

// Admin routes with role check middleware
router.post(
    '/register',
    [
        check('first_name', 'First name is required').not().isEmpty(),
        check('last_name', 'Last name is required').not().isEmpty(),
        check('email', 'Please provide a valid email').isEmail(),
        check('password', 'Password must be 6 characters or more').isLength({ min: 6 })
    ],
    registerAdmin
);

router.post('/login', loginAdmin);

// Only admins should access their profile
router.get('/profile', checkRole('admin'), getAdmin);

// Admin edit
router.put(
    '/edit',
    [
        checkRole('admin'),
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please provide a valid email').isEmail(),
        check('password', 'Password must be 6 characters or more').isLength({ min: 6 })
    ],
    editAdmin
);

router.get('/logout', checkRole('admin'), logoutAdmin);

module.exports = router;
