const express = require('express');
const router = express.Router();
const checkRole = require('../middleware/roleMiddleware');
const userController = require('../controllers/userController');
const providerController = require('../controllers/ProviderController')
const adminController = require('../controllers/adminController');

// Patient-specific route
router.post('/patient-dashboard', checkRole('patient'), userController.patientDashboard);

// Provider-specific route
router.post('/provider-dashboard', checkRole('provider'), providerController.providerDashboard);

// Admin-specific route
router.post('/admin-dashboard', checkRole('admin'), adminController.adminDashboard);

module.exports = router;
