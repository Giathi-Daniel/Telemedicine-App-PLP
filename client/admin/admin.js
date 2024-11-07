// Function to fetch and display doctors and patients
async function fetchTableData(type) {
    const response = await fetch(`/api/${type}`);
    const data = await response.json();
    renderTable(data, type);
}

// Render table function for doctors and patients
function renderTable(data, type) {
    const tableBody = document.getElementById(`${type}Table`);
    tableBody.innerHTML = '';
    data.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="p-2 border-b">${item.id}</td>
        <td class="p-2 border-b">${item.first_name}</td>
        <td class="p-2 border-b">${item.last_name}</td>
        <td class="p-2 border-b">${type === 'doctors' ? item.specialization : item.email}</td>
        <td class="p-2 border-b">
          <button onclick="edit${capitalize(type.slice(0, -1))}(${item.id})" class="text-blue-500">Edit</button>
          <button onclick="openDeleteConfirmation(${item.id}, '${type}')" class="text-red-500 ml-2">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
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
    const specialty = document.getElementById('specialty').value;
    const email = document.getElementById('email').value;
    const phone_number = document.getElementById('phone_number').value;
    await fetch('/api/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name, last_name, specialty, email, phone_number })
    });
    closeDoctorForm();
    fetchTableData('doctors');
}x

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
