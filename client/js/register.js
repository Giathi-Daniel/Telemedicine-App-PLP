// Role Selecetion
document.querySelectorAll('#role-selection span').forEach((span) => {
span.addEventListener('click', function() {
    const selectedRole = this.getAttribute('data-role');

    document.querySelectorAll('#role-selection span').forEach(s => s.classList.remove('selected'));

    // Add 'selected' class to the clicked span
    this.classList.add('selected');

    document.getElementById('patient-fields').style.display = 'none';
    document.getElementById('provider-fields').style.display = 'none';

    if (selectedRole === 'patient') {
    document.getElementById('patient-fields').style.display = 'flex';
    } else if (selectedRole === 'provider') {
    document.getElementById('provider-fields').style.display = 'flex';
    }

    // Add the role to the form data (hidden input to send the role to the backend)
    document.getElementById('role-selection').setAttribute('data-selected-role', selectedRole);
});
});

// Handle Register
document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const role = document.getElementById('role-selection').getAttribute('data-selected-role');
  const first_name = document.getElementById('first_name').value;
  const last_name = document.getElementById('last_name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  let date_of_birth = document.getElementById('date_of_birth') ? document.getElementById('date_of_birth').value : '';
  let language = document.getElementById('language') ? document.getElementById('language').value : '';
  let gender = document.getElementById('gender') ? document.getElementById('gender').value : '';
  let specialty = document.getElementById('specialty') ? document.getElementById('specialty').value : '';

  if (!role) {
    return alert('Please select a role.');
  }

  if (!first_name || !last_name || !email || !password) {
    return alert('Please fill in all required fields.');
  }

  if (role === 'patient' && (!date_of_birth || !language || !gender)) {
    return alert('Please fill in all patient-specific fields.');
  }

  if (role === 'provider' && !specialty) {
    return alert('Please provide your specialty.');
  }

  const response = await fetch('/telemedicine/api/patients/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ first_name, last_name, email, password, role, date_of_birth, language, gender, specialty }),
  });

  const data = await response.json();

  if (response.ok) {
    alert('Registration successful!');
    window.location.href = '/login'; 
  } else {
    alert(data.message);  
  }
});
