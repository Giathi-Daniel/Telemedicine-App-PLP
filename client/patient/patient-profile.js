getUser()

async function getUser(){
    const nameSpan = document.getElementById('userName')
    const emailSpan = document.getElementById('userEmail')

    try {
        const response = await fetch('/api/providers/profile')
        const result = await response.json()
        nameSpan.innerHTML = `${result.provider.first_name} ${result.provider.last_name}`
        emailSpan.innerHTML = `${result.provider.email}`
    } catch(err) {
        console.error(err)
    }
}