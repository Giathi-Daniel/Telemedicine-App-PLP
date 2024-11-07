// Function to fetch and display appointments for the patient
async function fetchAppointments() {
    const response = await fetch('/api/appointments');
    const data = await response.json();
    renderAppointmentsTable(data);
}

// Render appointments table
function renderAppointmentsTable(appointments) {
    const tableBody = document.getElementById('appointmentsTable');
    tableBody.innerHTML = '';
    appointments.forEach(appointment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="p-2 border-b">${appointment.patientName}</td>
            <td class="p-2 border-b">${appointment.doctorName}</td>
            <td class="p-2 border-b">${appointment.doctorPhone}</td>
            <td class="p-2 border-b">${appointment.appointmentTime}</td>
            <td class="p-2 border-b">
                <button onclick="cancelAppointment(${appointment.id})" class="text-red-500 ml-2">Cancel</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Open appointment booking form
function openAppointmentForm() {
    document.getElementById('appointmentFormModal').classList.remove('hidden');
}

// Close appointment booking form
function closeAppointmentForm() {
    document.getElementById('appointmentFormModal').classList.add('hidden');
}

// Book new appointment
async function bookAppointment() {
    const doctorName = document.getElementById('doctor_name').value;
    const doctorPhone = document.getElementById('doctor_phone').value;
    const appointmentTime = document.getElementById('appointment_time').value;

    await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorName, doctorPhone, appointmentTime })
    });

    closeAppointmentForm();
    fetchAppointments();
}

// Cancel an appointment
async function cancelAppointment(id) {
    await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
    fetchAppointments();
}

// Logout function
function logout() {
    const confirmLogout = confirm("Are you sure you want to log out?");
    if (confirmLogout) {
        fetch('/api/patients/logout').then(() => {
            window.location.href = '/';
        });
    } else {
        console.log("Logout canceled.");
    }
}


// Initialize data on page load
fetchAppointments();
