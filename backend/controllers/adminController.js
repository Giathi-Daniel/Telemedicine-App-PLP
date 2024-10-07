const db = require('../config/db')

exports.getDoctors = async (req, res) => {
    try {
        const [doctors] = await db.query('SELECT id, first_name, last_name, specialization, email, phone, schedule FROM Doctors');
        res.json(doctors)
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: 'Error fetching doctors' })
    }
}

exports.addDoctor = async (req, res) => {
    const {first_name, last_name, specialization, email, phone, schedule} = req.body

    try {
        const [existingDoctor] = await db.query('SELECT ^ FROM Doctors WHERE email = ?', [email])
        if(existingDoctor.length > 0) {
            return res.status(400).json({ message: 'Email already exist' })
        }

        await db.query(
            'INSERT INTO Doctors (first_name, last_name, specialization, email, phone, schedule) VALUES (?, ?, ?, ?, ?, ?)',
            [first_name, last_name, specialization, email, phone, schedule]
        )
        res.status(201).json({ message: 'Doctor added successfully' })
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}

exports.updateDoctor = async (req, res) => {
    const {first_name, last_name, specialization, phone, schedule} = req.body
    const {doctor_id} = req.params

    try {
        await db.query(
            'UPDATE Doctors SET first_name = ?, last_name = ?, specialization = ?, phone = ?, schedule = ? WHERE id = ?',
            [first_name, last_name, specialization, phone, schedule]
        )
        res.json({ message: 'Doctor profile updated successfully' })
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: 'Server error' })
    }
}

exports.deleteDoctor = async (req, res) => {
    const { doctor_id } = req.params
    
    try {
        await db.query('DELETE FROM Doctors WHERE id = ?', [doctor_id])
        res.json({ message: 'Doctor profile deleted successfully' })
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: 'Server error' })
    }
}

// view all appointments
exports.viewAppointments = async (req, res) => {
    try {
        const [appointments] = await db.query(
            'SELECT a.id, p.first_name AS patient_first_name, p.last_name AS patient_last_name, d.first_name AS doctor_first_name, d.last_name AS doctor_last_name, d.last_name AS doctor_last_name, a.appointment_time, a.status ' + 
            'FROM Appointments a ' +
            'JOIN Patients p ON a.patient_id = p.id ' +
            'JOIN Doctors d ON a.doctor_id = d.id'
        )
        res.json(appointments)
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: 'Server error' })
    }
}