const messageDiv = document.getElementById('message')

function showMessage(type, text) {
    messageDiv.style.display = 'block'

    if(type == 'success') {
        messageDiv.style.backgroundColor = 'green'
    } else {
        messageDiv.style.backgroundColor = 'red'
    }

    messageDiv.style.color = 'white'
    messageDiv.textContent = text //display the actual msg

    setTimeout(() => {
        messageDiv.style.display = 'none'
    }, 3000) // hide the display button after 3 seconds
}

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  // fetch data from the form
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    return alert("Please enter both email and password.");
  }

  // Send the login data to the backend
  const response = await fetch("http://localhost:3200/telemedicine/api/patients/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (response.ok) {
    alert("Login successful!");
    window.location.href = data.redirectUrl; // Redirect to the appropriate dashboard
  } else {
    alert(data.message); // Show error message
  }
});