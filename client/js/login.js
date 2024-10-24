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
  const role = document.querySelector('input[name="role"]:checked').value;

  if (!email || !password || !role) {
    return showMessage('error', "Please enter email, password, and select a role.");
  }

  let loginUrl;
  if (role === 'patient') {
    loginUrl = 'http://localhost:3200/telemedicine/api/patients/login';
  } else if (role === 'provider') {
    loginUrl = 'http://localhost:3200/telemedicine/api/providers/login';
  } else if (role === 'admin') {
    loginUrl = 'http://localhost:3200/telemedicine/api/admin/login';
  }

  const response = await fetch(loginUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (response.ok) {
    showMessage('success', "Login successful!");
    window.location.href = data.redirectUrl; 
  } else {
    showMessage(data.message);
  }
});
