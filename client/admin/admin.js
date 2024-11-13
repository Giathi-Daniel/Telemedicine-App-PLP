document.getElementById('doctorsTable').innerHTML = ''
// fetch providers information and display it in the table
getProviders()

// Function to fetch and display doctors and patients
async function fetchTableData(type) {
    const response = await fetch(`/api/${type}`);
    const data = await response.json();
    renderTable(data, type);
}

// Render table function for doctors and patients
function renderTable(data, type) {
    const tableBody = document.getElementById(`${type}Table`);
      const tableData = `
        <tr>
            <td class="p-2 border-b">${data.provider_id}</td>
            <td class="p-2 border-b">${data.first_name}</td>
            <td class="p-2 border-b">${data.last_name}</td>
            <td class="p-2 border-b">${data.provider_specialty}</td>
            <td class="p-2 border-b">${data.email}</td>
            <td class="p-2 border-b">${data.phone_number}</td>
            <td class="p-2 border-b">
            <button onclick="edit${(type.slice(0, -1))}(${data.provider_id})" class="text-blue-500">Edit</button>
            <button onclick="openDeleteConfirmation(${data.provider_id}, '${type}')" class="text-red-500 ml-2">Delete</button>
            </td>
        </tr>
      `;
    tableBody.innerHTML += tableData; 
}

// Add doctor form and modal functions
function openDoctorForm() {
    document.getElementById('doctorFormModal').classList.remove('hidden');
}

function closeDoctorForm() {
    document.getElementById('doctorFormModal').classList.add('hidden');
}

async function addDoctor() {
    const first_name = document.getElementById('first_name').value;
    const last_name = document.getElementById('last_name').value;
    const provider_specialty = document.getElementById('specialty').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const phone_number = document.getElementById('phone_number').value;
    const response = await fetch('/api/providers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name, last_name, password, provider_specialty, email, phone_number })
    });
    const result = await response.json()
    alert(result.message)
    closeDoctorForm();
    fetchTableData('doctors');
}

async function getProviders(){
    const response = await fetch('/api/admins/providers')
    const result = await response.json()
    if(response.ok) {
        const provider = result.provider
        provider.forEach(data => {
            renderTable(data, 'doctors')
        })
    } else {
        alert(result.message)
    }
}


// Delete confirmation modal functions
function openDeleteConfirmation(id, type) {
    document.getElementById('deleteConfirmationModal').classList.remove('hidden');
    window.confirmDelete = async function() {
        await fetch(`/api/${type}/${id}`, { method: 'DELETE' });
        closeDeleteConfirmation();
        fetchTableData(type);
    };
}

function closeDeleteConfirmation() {
    document.getElementById('deleteConfirmationModal').classList.add('hidden');
}

// Patient Form Modal functions
function openPatientForm() {
    document.getElementById('patientFormModal').classList.remove('hidden');
  }
  
  function closePatientForm() {
    document.getElementById('patientFormModal').classList.add('hidden');
  }
  
  async function addPatient() {
    const first_name = document.getElementById('patient_first_name').value;
    const last_name = document.getElementById('patient_last_name').value;
    const password = document.getElementById('patient_password').value;
    const email = document.getElementById('patient_email').value;
    const date_of_birth = document.getElementById('patient_dob').value;
    const language = document.getElementById('patient_language').value;
    const gender = document.getElementById('patient_gender').value;
  
    await fetch('/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ first_name, last_name, password, email, date_of_birth, language, gender })
    });
  
    closePatientForm();
    fetchTableData('patients');
}

// Pagination 
let currentPage = 1;
const itemsPerPage = 10;

function nextPage(type) {
    currentPage++;
    fetchTableData(type);
}

function prevPage(type) {
    if (currentPage > 1) {
        currentPage--;
        fetchTableData(type);
    }
}

// Initialize data
fetchTableData('doctors');
fetchTableData('patients');
