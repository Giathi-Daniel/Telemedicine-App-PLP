// edit details
document.getElementById('editForm').addEventListener('submit', async(e) => {
    e.preventDefault()

    // fetch data from the form
    const first_name = document.getElementById('editFirstName').value
    const last_name = document.getElementById('editLastName').value
    const language = document.getElementById('editLanguage').value
    const password = document.getElementById('editPassword').value

    // transmit data
    const response = await fetch('/telemedicine/api/patients/edit', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ first_name, last_name, language, password })
    })

    const result = await response.json()

    if(response.status === 200) {
        showMessage('Success', result.message)
        getUser();
    } else {
        showMessage('failed', result.message)
    }
})

// logout 
logoutBtn.addEventListener('click', async () => {
    const response = await fetch('/telemedicine/api/patients/logout', {
        method: 'POST'
    })

    if(response.status === 200) {
        const result = await response.json()
        showMessage('success', result.message)
        window.location.href ="../index.html"
    } else {
        showMessage('error occured', result.message)
    }
})