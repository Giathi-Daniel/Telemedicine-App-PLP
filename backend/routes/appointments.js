const express = require('express')
const router = express.Router()
const db = require('../config/db')
const auth = require('../middleware/auth'); //protect the route

router.post('/appointments', auth, async (req, res) => {
    const { doctor_id, appointment_date, appointment_time } = req.body;
    const patient_id = req.user.id;

    try {
        // Extract the day of the week from the appointment date
        const [doctor] = await db.query(
            `SELECT * 
             FROM Doctors 
             WHERE id = ? 
             AND JSON_CONTAINS(JSON_EXTRACT(schedule, CONCAT('$.', DAYNAME(?))), ?)`, 
            [doctor_id, appointment_date, appointment_time]
        );

        if (doctor.length === 0) {
            return res.status(400).json({ message: 'Doctor is not available at the selected time' });
        }

        // Book the appointment
        await db.query(
            'INSERT INTO Appointments (patient_id, doctor_id, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, "scheduled")', 
            [patient_id, doctor_id, appointment_date, appointment_time]
        );

        res.status(201).json({ message: 'Appointment booked successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


router.get('/appointments/patient', auth, async (req, res) => {
    const patient_id = req.user.id;

    try {
        const [appointments] = await db.query(
            'SELECT A.id, D.first_name AS doctor_first_name, D.last_name AS doctor_last_name, A.appointment_date, A.appointment_time, A.status FROM Appointments A JOIN Doctors D ON A.doctor_id = D.id WHERE A.patient_id = ? AND A.status != "canceled"',
            [patient_id]
        );
        res.json(appointments);
    } catch (error) {
        console.error('Error while fetching appointment:', error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

router.get('/appointments/doctor', auth, async (req, res) => {
    const doctor_id = req.user.id; 

    try {
        const [appointments] = await db.query(
            'SELECT A.id, P.first_name AS patient_first_name, P.last_name AS patient_last_name, A.appointment_date, A.appointment_time, A.status FROM Appointments A JOIN Patients P ON A.patient_id = P.id WHERE A.doctor_id = ? AND A.status != "canceled"',
            [doctor_id]
        );
        res.json(appointments);
    } catch (error) {
        console.error('Error while fetching appointments:', error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

router.put('/appointments/:id/reschedule', auth, async (req, res) => {
    const { appointment_date, appointment_time } = req.body;
    const appointment_id = req.params.id;
    const patient_id = req.user.id;

    try {
        // Find the appointment and ensure it belongs to the logged-in patient
        const [appointment] = await db.query(
            'SELECT * FROM Appointments WHERE id = ? AND patient_id = ? AND status = "scheduled"',
            [appointment_id, patient_id]
        );

        if (appointment.length === 0) {
            return res.status(404).json({ message: 'Appointment not found or cannot be rescheduled' });
        }

        // Check if the doctor is available at the new time
        const doctor_id = appointment[0].doctor_id;
        const [doctor] = await db.query(
            'SELECT * FROM Doctors WHERE id = ? AND JSON_CONTAINS(schedule, JSON_OBJECT("date", ?, "time", ?))',
            [doctor_id, appointment_date, appointment_time]
        );

        if (doctor.length === 0) {
            return res.status(400).json({ message: 'Doctor is not available at the selected time' });
        }

        // Update appointment time
        await db.query(
            'UPDATE Appointments SET appointment_date = ?, appointment_time = ? WHERE id = ?',
            [appointment_date, appointment_time, appointment_id]
        );

        res.json({ message: 'Appointment rescheduled successfully', appointment: updatedAppointment });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


router.delete('/appointments/:id/cancel', auth, async (req, res) => {
    const appointment_id = req.params.id;
    const patient_id = req.user.id;

    try {
        // Find the appointment and ensure it belongs to the logged-in patient
        const [appointment] = await db.query(
            'SELECT * FROM Appointments WHERE id = ? AND patient_id = ? AND status = "scheduled"',
            [appointment_id, patient_id]
        );

        if (appointment.length === 0) {
            return res.status(404).json({ message: 'Appointment not found or cannot be canceled' });
        }

        // Update appointment status to 'canceled'
        await db.query(
            'UPDATE Appointments SET status = "canceled" WHERE id = ?',
            [appointment_id]
        );

        res.json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        console.error('Error deleting appointment:', error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

module.exports = router;