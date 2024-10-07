const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config()

const app = express();

app.use(bodyParser.json());

const patientRoutes = require('./routes/patients')
const doctorRoutes = require('./routes/doctors')
const appointmentRoutes = require('./routes/appointments')
const adminRoutes = require('./routes/admin')

app.use('/patients', patientRoutes);
app.use('/doctors', doctorRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/admin', adminRoutes);

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})