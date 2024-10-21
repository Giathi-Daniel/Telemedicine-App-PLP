document.addEventListener('DOMContentLoaded', () => {
    initializeFormValidation();
    initializePasswordStrengthMeter();
    initializeStepNavigation();
    initializePasswordToggle();
    initializeFormToggle();
});

function initializeFormValidation() {
    const form = document.getElementById('signupForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const isPatientForm = document.getElementById('patientForm').style.display === 'block';
        const isDoctorForm = document.getElementById('doctorForm').style.display === 'block';

        if (isPatientForm) {
            validatePatientForm();
        } else if (isDoctorForm) {
            validateDoctorForm();
        }
    });
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach(el => el.innerText = '');
}

function showError(elementId, message) {
    document.getElementById(elementId).innerText = message;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePasswordStrength(password) {
    return calculatePasswordStrength(password) >= 40;
}

function calculatePasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/\d/.test(password)) strength += 20;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 20;
    return strength;
}

function initializePasswordStrengthMeter() {
    const passwordInput = document.getElementById('password');
    const strengthMeter = document.getElementById('strengthMeter');
    const strengthValue = document.getElementById('strengthValue');

    passwordInput.addEventListener('input', () => {
        const strength = calculatePasswordStrength(passwordInput.value);
        strengthMeter.value = strength;

        strengthValue.innerText = strength < 40 ? 'Weak' : strength < 80 ? 'Medium' : 'Strong';
        strengthValue.style.color = strength < 40 ? 'red' : strength < 80 ? 'orange' : 'green';
    });
}

function initializeStepNavigation() {
    document.querySelectorAll('.nextBtn').forEach(btn => {
        btn.addEventListener('click', () => toggleStep(btn.dataset.hide, btn.dataset.show));
    });
    document.querySelectorAll('.prevBtn').forEach(btn => {
        btn.addEventListener('click', () => toggleStep(btn.dataset.hide, btn.dataset.show));
    });
}

function toggleStep(hideId, showId) {
    document.getElementById(hideId).style.display = 'none';
    document.getElementById(showId).style.display = 'block';
}

function initializePasswordToggle() {
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
    });
}

function initializeFormToggle() {
    const patientImage = document.getElementById('patientImage');
    const doctorImage = document.getElementById('doctorImage');
    const patientForm = document.getElementById('patientForm');
    const doctorForm = document.getElementById('doctorForm');

    patientImage.addEventListener('click', () => {
        patientForm.style.display = 'block';
        doctorForm.style.display = 'none';
    });

    doctorImage.addEventListener('click', () => {
        patientForm.style.display = 'none';
        doctorForm.style.display = 'block';
    });
}

function validatePatientForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.getElementById('terms').checked;

    let isValid = true;
    clearErrors();

    if (!name) {
        showError('nameError', 'Name is required');
        isValid = false;
    }

    if (!validateEmail(email)) {
        showError('emailError', 'Invalid email format');
        isValid = false;
    } else if (emailAlreadyExists(email)) {
        showError('emailError', 'This email is already registered');
        isValid = false;
    }

    if (!validatePasswordStrength(password)) {
        showError('passwordError', 'Password is too weak');
        isValid = false;
    }

    if (password !== confirmPassword) {
        showError('confirmPasswordError', 'Passwords do not match');
        isValid = false;
    }

    if (!terms) {
        showError('termsError', 'You must accept the terms and conditions');
        isValid = false;
    }

    if (isValid) {
        alert('Patient sign-up successful!');
        // Handle form submission
    }
}

function validateDoctorForm() {
    const name = document.getElementById('nameDoctor').value.trim();
    const email = document.getElementById('emailDoctor').value.trim();
    const password = document.getElementById('passwordDoctor').value;
    const confirmPassword = document.getElementById('confirmPasswordDoctor').value;
    const profession = document.getElementById('profession').value.trim();
    const terms = document.getElementById('termsDoctor').checked;

    let isValid = true;
    clearErrors();

    if (!name) {
        showError('nameDoctorError', 'Name is required');
        isValid = false;
    }

    if (!validateEmail(email)) {
        showError('emailDoctorError', 'Invalid email format');
        isValid = false;
    } else if (emailAlreadyExists(email)) {
        showError('emailDoctorError', 'This email is already registered');
        isValid = false;
    }

    if (!validatePasswordStrength(password)) {
        showError('passwordDoctorError', 'Password is too weak');
        isValid = false;
    }

    if (password !== confirmPassword) {
        showError('confirmPasswordDoctorError', 'Passwords do not match');
        isValid = false;
    }

    if (!profession) {
        showError('professionError', 'Profession is required');
        isValid = false;
    }

    if (!terms) {
        showError('termsDoctorError', 'You must accept the terms and conditions');
        isValid = false;
    }

    if (isValid) {
        alert('Doctor sign-up successful!');
        // Handle form submission
    }
}

function emailAlreadyExists(email) {
    const existingEmails = ['test@docucare.com', 'user@example.com'];
    return existingEmails.includes(email);
}
