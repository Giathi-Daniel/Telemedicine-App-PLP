const messageDiv = document.getElementById('message')
const userSection = document.getElementById('userSection')
const userNameSpan = document.getElementById('userName')
const userEmailSpan = document.getElementById('userEmail')
const logoutBtn = document.getElementById('logoutButton')

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

// register form
document.getElementById('registerForm').addEventListener('submit', async(e) => {
    e.preventDefault()

    // fetch data from the form
    const name = document.getElementById('regName').value
    const email = document.getElementById('regEmail').value
    const password = document.getElementById('regPassword').value

    // transmit the data
    const response = await fetch('/telemedicine/api/users/register-user', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
    })

    const result = await response.json()

    // chech status of the response
    if(result.status === 201) {
        showMessage('success', result.message)
    } else {
        showMessage('failed', result.message)
    }
})

// login form
document.getElementById('loginForm').addEventListener('submit', async(e) => {
    e.preventDefault()

    // fetch data from the form
    const email = document.getElementById('loginEmail').value
    const password = document.getElementById('loginPassword').value

    // transmit the data
    const response = await fetch('/telemedicine/api/users/login-user', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })

    const result = await response.json()

    // chech status of the response
    if(result.status === 201) {
        showMessage('success', result.message)
    } else {
        showMessage('failed', result.message)
    }
})

// fetch user details
async function getUserDetails() {
    // transmit the request
    const response = await fetch('/telemedicine/api/users/profile', {
        method: 'GET'
    })

    if(response.status === 200) {
        const result = await response.json() // transform the response to json
        userNameSpan.textContent = result.user.name,
        userEmailSpan.textContent = result.user.email,
        userSection.style.display = 'block'
    } else {
        showMessage('failed', result.message)
    }
}

// edit user
document.getElementById('editForm').addEventListener('submit', async(e) => {
    e.preventDefault()

    // fetch data from the form
    const name = document.getElementById('editName').value
    const email = document.getElementById('editEmail').value
    const password = document.getElementById('editPassword').value

    // transmit the data
    const response = await fetch('/telemedicine/api/users/user/edit', {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
    })

    const result = await response.json()

    // chech status of the response
    if(result.status === 200) {
        showMessage('success', result.message)
        getUserDetails()
    } else {
        showMessage('failed', result.message)
    }
})

// logout
logoutBtn.addEventListener('click', async () => {
    const response = await fetch('/telemedicine/api/users/logout', {
        method: 'POST'
    })

    if(response.status === 200) {
        const result = await response.json() 
        showMessage('success', result.message)
        userSection.style.display = 'none'
    } else {
        showMessage('failed', result.message)
    }
})