async function fetchAppointments() {
    const response = await fetch('/api/appointments'); 
    const appointments = await response.json();
    renderAppointmentsTable(appointments);
}

function renderAppointmentsTable(appointments) {
    const tableBody = document.getElementById('appointmentsTable');
    tableBody.innerHTML = '';
    appointments.forEach(appointment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="p-2 border-b">${appointment.patientName}</td>
            <td class="p-2 border-b">${appointment.patientEmail}</td>
            <td class="p-2 border-b">${new Date(appointment.time).toLocaleString()}</td>
            <td class="p-2 border-b">
                <button onclick="updateAppointment(${appointment.id})" class="text-blue-500">Update</button>
                <button onclick="cancelAppointment(${appointment.id})" class="text-red-500 ml-2">Cancel</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function updateAppointment(appointmentId) {
    const newTime = prompt("Enter new appointment time (YYYY-MM-DDTHH:mm):");
    if (newTime) {
        fetch(`/api/appointments/${appointmentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ time: newTime })
        }).then(() => fetchAppointments());
    }
}

function cancelAppointment(appointmentId) {
    const confirmCancel = confirm("Are you sure you want to cancel this appointment?");
    if (confirmCancel) {
        fetch(`/api/appointments/${appointmentId}`, { method: 'DELETE' })
            .then(() => fetchAppointments());
    }
}

function logout() {
    const confirmLogout = confirm("Are you sure you want to log out?");
    if (confirmLogout) {
        fetch('/api/providers/logout').then(() => {
            window.location.href = '/';
        });
    } else {
        console.log("Logout canceled.");
    }
}

// Initialize data
fetchAppointments();
