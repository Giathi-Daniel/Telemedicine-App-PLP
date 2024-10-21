document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const loginForm = document.getElementById('loginForm');
    const patientForm = document.getElementById('patientForm');
    const doctorForm = document.getElementById('doctorForm');
    const doctorImage = document.getElementById('doctorImage');
    const patientImage = document.getElementById('patientImage');

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const loginError = document.getElementById('loginError');
    const passwordStrengthDiv = document.getElementById('passwordStrength');
    
    const doctorEmailInput = document.getElementById('doctorEmail');
    const doctorPasswordInput = document.getElementById('doctorPassword');
    const professionInput = document.getElementById('profession');
    const doctorRememberMeCheckbox = document.getElementById('doctorRememberMe');
    const doctorLoginError = document.getElementById('doctorLoginError');

    // Create and append suggestions div
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.id = 'passwordSuggestions';
    passwordStrengthDiv.appendChild(suggestionsDiv);

    const doctorSuggestionsDiv = document.createElement('div');
    doctorSuggestionsDiv.id = 'doctorPasswordSuggestions';
    doctorPasswordInput.parentElement.appendChild(doctorSuggestionsDiv);

    // Mock login function
    function mockLogin(email, password) {
        const users = [
            { email: 'doctor@docucare.com', password: 'Doctor123!' },
            { email: 'patient@docucare.com', password: 'Patient123!' }
        ];
        return users.some(user => user.email === email && user.password === password);
    }

    // Validate email function
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Validate password function
    function validatePassword(password) {
        return password.length >= 6;
    }

    // Validate doctor form
    function validateDoctorForm() {
        let valid = true;

        if (!validateEmail(doctorEmailInput.value)) {
            document.getElementById('doctorEmailError').innerText = 'Invalid email format';
            valid = false;
        } else {
            document.getElementById('doctorEmailError').innerText = '';
        }

        if (!validatePassword(doctorPasswordInput.value)) {
            document.getElementById('doctorPasswordError').innerText = 'Password must be at least 6 characters';
            valid = false;
        } else {
            document.getElementById('doctorPasswordError').innerText = '';
        }

        if (professionInput.value.trim() === '') {
            document.getElementById('professionError').innerText = 'Profession is required';
            valid = false;
        } else {
            document.getElementById('professionError').innerText = '';
        }

        return valid;
    }

    // Handle form submission
    function handleSubmit(event) {
        event.preventDefault();

        if (doctorForm.style.display === 'none') {
            const email = emailInput.value;
            const password = passwordInput.value;

            loginError.innerText = '';

            if (!validateEmail(email)) {
                loginError.innerText = 'Invalid email format';
                return;
            }

            if (!mockLogin(email, password)) {
                loginError.innerText = 'Incorrect email or password';
                return;
            }

            alert('Login successful!');

            if (rememberMeCheckbox.checked) {
                localStorage.setItem('email', email);
                localStorage.setItem('rememberMe', 'true');
            } else {
                localStorage.removeItem('email');
                localStorage.removeItem('rememberMe');
            }
        } else {
            if (!validateDoctorForm()) {
                return;
            }

            const doctorEmail = doctorEmailInput.value;
            const doctorPassword = doctorPasswordInput.value;

            doctorLoginError.innerText = '';

            if (!mockLogin(doctorEmail, doctorPassword)) {
                doctorLoginError.innerText = 'Incorrect email or password';
                return;
            }

            alert('Login successful!');

            if (doctorRememberMeCheckbox.checked) {
                localStorage.setItem('doctorEmail', doctorEmail);
                localStorage.setItem('doctorRememberMe', 'true');
            } else {
                localStorage.removeItem('doctorEmail');
                localStorage.removeItem('doctorRememberMe');
            }
        }
    }

    // Update password suggestions
    function updatePasswordSuggestions(input, suggestionsDiv) {
        const password = input.value;
        const suggestions = [];

        if (!/[A-Z]/.test(password)) suggestions.push("Add an uppercase letter");
        if (!/[a-z]/.test(password)) suggestions.push("Add a lowercase letter");
        if (!/[0-9]/.test(password)) suggestions.push("Add a digit");
        if (!/[!@#$%^&*]/.test(password)) suggestions.push("Add a special character");

        suggestionsDiv.innerHTML = suggestions.length ? `Suggestions: ${suggestions.join(', ')}` : '';
    }

    // Event listeners
    loginForm.addEventListener('submit', handleSubmit);
    doctorForm.addEventListener('submit', handleSubmit);

    doctorImage.addEventListener('click', function() {
        patientForm.style.display = 'none';
        doctorForm.style.display = 'block';
    });

    patientImage.addEventListener('click', function() {
        doctorForm.style.display = 'none';
        patientForm.style.display = 'block';
    });

    passwordInput.addEventListener('input', function() {
        updatePasswordSuggestions(passwordInput, suggestionsDiv);
    });

    doctorPasswordInput.addEventListener('input', function() {
        updatePasswordSuggestions(doctorPasswordInput, doctorSuggestionsDiv);
    });

    // Load saved email and rememberMe state
    const savedEmail = localStorage.getItem('email');
    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberMeCheckbox.checked = true;
    }

    const savedDoctorEmail = localStorage.getItem('doctorEmail');
    if (savedDoctorEmail) {
        doctorEmailInput.value = savedDoctorEmail;
        doctorRememberMeCheckbox.checked = true;
    }
});
