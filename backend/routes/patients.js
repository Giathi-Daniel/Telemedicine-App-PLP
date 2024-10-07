const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const adminAuth = require('../middleware/adminAuth')
const auth = require('../middleware/auth')

router.get('/', adminAuth, patientController.getPatients)

// register
router.post('/register', patientController.registerPatient)

// update 
router.put('/profile', auth, patientController.updatePatient)

// delete
router.delete('/profile', auth, patientController.deletePatient)

module.exports = router;