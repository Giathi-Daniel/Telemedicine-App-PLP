const db = require('../config/db')

exports.getDoctorProfile = async (req, res) => {
    try {
        const [doctor] = await db.query(
            'SELECT id, first_name, last_name, specialization, email, phone, schedule FROM Doctors WHERE id = ?',
            [req.user.id]
        )
        if(doctor.length === 0) {
            return res.status(404).json({ message: 'Doctor not found' })
        }
        res.json(doctor[0])
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: 'Server error' })
    }
}

exports.updateDoctorProfile = async (req, res) => {
    const { first_name, last_name, specialization, phone, schedule } = req.body

    try {
        await db.query(
            'UPDATE Doctors SET first_name = ?, last_name = ?, specialization = ?, phone = ?, schedule = ? WHERE id = ?',
            [first_name, last_name, specialization, phone, schedule, req.user.id]
        )
        res.json({ message: 'Profile updated successfully' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server error' })
    }
}

exports.viewDoctorAppointments = async (req, res) => {
    try {
        const [appointments] = await db.query(
            'SELECT a.id, p.first_name AS patient_first_name, a.last_name AS patient_last_name, a.appointment_date, a.appointment_time, a.status ' +
            'FROM Appointments a ' +
            'JOIN Patients p ON a.patient_id = p.id ' +
            'WHERE a.doctor_id = ? ' +
            'ORDER BY a.appointment_date DESC'
            [req.user.id]
        )
        res.json(appointments)
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: 'Server error' })
    } 
}