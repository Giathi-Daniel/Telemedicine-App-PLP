// get doctor profile information
getProvider()

async function getProvider  () {
    const nameSpan = document.getElementById('userName')
    const emailSpan = document.getElementById('userEmail')
    const specialtySpan = document.getElementById('userSpecialty')

    try {
        const response = await fetch('/api/providers/profile')
        const result = await response.json()
        nameSpan.innerHTML = `${result.provider.first_name} ${result.provider.last_name}`
        emailSpan.innerHTML = `${result.provider.email}`
        specialtySpan.innerHTML = `${result.provider.provider_specialty}`
    } catch(err) {
        console.error(err)
    }
}