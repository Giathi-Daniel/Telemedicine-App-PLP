const express = require('express')
const router = express.Router()
const adminAuth = require('../middleware/adminAuth')
const adminController = require('../controllers/adminController')

router.get('/doctors', adminAuth, adminController.getDoctors)

router.post('/doctors', adminAuth, adminController.addDoctor)

router.put('/doctors/:doctor_id', adminAuth, adminController.updateDoctor)

router.delete('/doctors/:doctor_id', adminAuth, adminController.deleteDoctor)

router.get('/appointments', adminAuth, adminController.viewAppointments)

module.exports = router