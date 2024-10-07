const db = require('../config/db');
const bcrypt = require('bcrypt');

// Get all patients (Admin only)
exports.getPatients = async (req, res) => {
    const { search, gender, date_of_birth } = req.query; // Optional filters

    let query = 'SELECT id, first_name, last_name, gender, date_of_birth FROM Patients';
    let queryParams = [];

    // Filters for searching
    if (search) {
        query += ' WHERE (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)';
        queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (gender) {
        query += query.includes('WHERE') ? ' AND' : ' WHERE';
        query += ' gender = ?';
        queryParams.push(gender);
    }

    if (date_of_birth) {
        query += query.includes('WHERE') ? ' AND' : ' WHERE';
        query += ' date_of_birth = ?';
        queryParams.push(date_of_birth);
    }

    try {
        const [patients] = await db.query(query, queryParams);
        res.json(patients);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Register a new patient
exports.registerPatient = async (req, res) => {
    const { first_name, last_name, email, password, phone, date_of_birth, gender, address } = req.body;

    try {
        // Check if patient already exists
        const [existingPatient] = await db.query('SELECT * FROM Patients WHERE email = ?', [email]);
        if (existingPatient.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert the new patient
        await db.query(
            'INSERT INTO Patients (first_name, last_name, email, password_hash, phone, date_of_birth, gender, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
            [first_name, last_name, email, hashedPassword, phone, date_of_birth, gender, address]
        );

        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update patient profile
exports.updatePatient = async (req, res) => {
    const { first_name, last_name, phone, date_of_birth, gender, address } = req.body;

    try {
        await db.query(
            'UPDATE Patients SET first_name = ?, last_name = ?, phone = ?, date_of_birth = ?, gender = ?, address = ? WHERE id = ?',
            [first_name, last_name, phone, date_of_birth, gender, address, req.user.id]
        );
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a patient account
exports.deletePatient = async (req, res) => {
    try {
        await db.query('DELETE FROM Patients WHERE id = ?', [req.user.id]);
        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
