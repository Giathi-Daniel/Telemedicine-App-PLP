document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  // fetch data from the form
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    return alert("Please enter both email and password.");
  }

  // Send the login data to the backend
  const response = await fetch("/login", {
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