const express = require('express');
const db = require('./config/db');
const bcrypt = require('bcrypt');

const app = express();

// Get all patients (Admin only)
exports.getPatients = async (req, res) => {
  try {
    const { search, gender, date_of_birth } = req.query; // Optional filters
    let query = 'SELECT id, first_name, last_name, gender, date_of_birth FROM Patients';
    let queryParams = [];
    let whereClause = [];

    // Filters for searching
    if (search) {
      const searchParam = `%${search}%`;
      whereClause.push("(first_name LIKE ? OR last_name LIKE ? OR gender LIKE ?)");
      queryParams.push(searchParam, searchParam, searchParam);
    }

    if (gender) {
      whereClause.push("gender = ?");
      queryParams.push(gender);
    }

    if (date_of_birth) {
      whereClause.push("date_of_birth = ?");
      queryParams.push(date_of_birth);
    }

    // Add WHERE clause to query if there are filters
    if (whereClause.length > 0) {
      query += ' WHERE ' + whereClause.join(' AND ');
    }

    const [patients] = await db.query(query, queryParams);

    res.json(patients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
