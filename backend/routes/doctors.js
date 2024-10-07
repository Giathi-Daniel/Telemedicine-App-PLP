const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const doctorController = require('../controllers/doctorController')

router.get('/profile', auth, doctorController.getDoctorProfile)

router.put('/profile', auth, doctorController.updateDoctorProfile)

router.get('/appointments', auth, doctorController.viewDoctorAppointments)

module.exports = router;