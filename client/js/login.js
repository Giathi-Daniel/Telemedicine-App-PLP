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

let selectedRole = null;

// Handle role selection
document.querySelectorAll('#role-selection span').forEach((span) => {
  span.addEventListener('click', function () {
    document.querySelectorAll('#role-selection span').forEach((s) => s.classList.remove('selected'));
    this.classList.add('selected');

    selectedRole = this.getAttribute('data-role');
  });
});

// Login
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Change 'role' to 'selectedRole'
  if (!email || !password || !selectedRole) {
    return showMessage('error', "Please enter email, password, and select a role.");
  }

  let loginUrl;
  if (selectedRole === 'patient') {
    loginUrl = '/telemedicine/api/patients/login';
  } else if (selectedRole === 'provider') {
    loginUrl = '/telemedicine/api/provider/login';
  } else if (selectedRole === 'admin') {
    loginUrl = '/telemedicine/api/admin/login';
  }

  const response = await fetch(loginUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (response.ok) {
    showMessage('success', "Login successful!");
    window.location.href = '/patient/dashoard'; 
  } else {
    showMessage(data.message);
  }
});
