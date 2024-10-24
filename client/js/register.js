const messageDiv = document.getElementById('message');

function showMessage(type, text) {
  messageDiv.style.display = 'block';
  messageDiv.style.backgroundColor = type === 'success' ? 'green' : 'red';
  messageDiv.style.color = 'white';
  messageDiv.textContent = text;

  setTimeout(() => {
    messageDiv.style.display = 'none';
  }, 3000);
}


document.querySelectorAll('#role-selection span').forEach((span) => {
  span.addEventListener('click', function() {
    const selectedRole = this.getAttribute('data-role');

    // Remove selected class from all roles and add to the clicked one
    document.querySelectorAll('#role-selection span').forEach(s => s.classList.remove('selected'));
    this.classList.add('selected');

    // Hide all role-specific fields initially
    const patientFields = document.getElementById('patient-fields');
    const providerFields = document.getElementById('provider-fields');
    const adminFields = document.getElementById('admin-fields');

    patientFields.style.display = 'none';
    providerFields.style.display = 'none';
    if (adminFields) adminFields.style.display = 'none';

    // Reset required fields for all inputs and selects
    const allRequiredFields = document.querySelectorAll('input[required], select[required]');
    allRequiredFields.forEach(field => field.removeAttribute('required'));

    // Show relevant fields and make them required based on role
    if (selectedRole === 'patient') {
      patientFields.style.display = 'flex';
      patientFields.querySelectorAll('input, select').forEach(field => field.setAttribute('required', true));
    } else if (selectedRole === 'provider') {
      providerFields.style.display = 'flex';
      providerFields.querySelectorAll('input').forEach(field => field.setAttribute('required', true));
    } else if (selectedRole === 'admin') {
      // Admin-specific fields (if any) would be displayed here
      if (adminFields) {
        adminFields.style.display = 'flex';
        adminFields.querySelectorAll('input').forEach(field => field.setAttribute('required', true));
      }
    }

    // Store the selected role in the DOM for later use
    document.getElementById('role-selection').setAttribute('data-selected-role', selectedRole);
  });
});


// Handle Register
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const role = document.getElementById('role-selection').getAttribute('data-selected-role');
  const first_name = document.getElementById('first_name').value;
  const last_name = document.getElementById('last_name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Initialize role-specific fields
  let date_of_birth = '';
  let language = '';
  let gender = '';
  let specialty = '';

  // Get role-specific data based on the selected role
  if (role === 'patient') {
    date_of_birth = document.getElementById('date_of_birth').value;
    language = document.getElementById('language').value;
    gender = document.getElementById('gender').value;
    if (!date_of_birth || !language || !gender) {
      return showMessage('error', 'Please fill in all patient-specific fields.');
    }
  } else if (role === 'provider') {
    specialty = document.getElementById('specialty').value;
    if (!specialty) {
      return showMessage('error', 'Please provide your specialty.');
    }
  }

  if (!first_name || !last_name || !email || !password) {
    return showMessage('error', 'Please fill in all required fields.');
  }

  // Determine the correct API endpoint based on role
  let url = '';
  if (role === 'patient') {
    url = 'http://localhost:3200/telemedicine/api/patients/register';
  } else if (role === 'provider') {
    url = 'http://localhost:3200/telemedicine/api/providers/register';
  } else if (role === 'admin') {
    url = 'http://localhost:3200/telemedicine/api/admin/register';
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      first_name, last_name, email, password, role,
      date_of_birth, language, gender, specialty 
    })
  });

  const data = await response.json();

  if (response.ok) {
    showMessage('success', 'Registration successful!');
    window.location.href = '/login'; 
  } else {
    showMessage(data.message);
  }
});
