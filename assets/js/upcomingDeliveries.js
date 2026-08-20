function formatDate(value) {
  if (!value) {
    return '-';
  }
  const [year, month, day] = value.split('-');
  return year && month && day ? `${day}-${month}-${year}` : value;
}

function escapeHtml(value) {
  const container = document.createElement('div');
  container.textContent = value == null ? '' : value;
  return container.innerHTML;
}

function localDateString(date) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

function setDefaultDeliveryDates() {
  const today = new Date();
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + 7);
  document.getElementById('startDate').value = localDateString(today);
  document.getElementById('endDate').value = localDateString(endDate);
}

function renderDeliveries(patients) {
  const container = document.getElementById('tableBody');
  const count = document.getElementById('deliveryCount');
  container.innerHTML = '';

  if (!patients.length) {
    container.innerHTML = '<tr><td colspan="11" class="text-center">No upcoming deliveries found for the selected dates.</td></tr>';
    count.textContent = '0 patients';
    return;
  }

  patients.forEach((patient, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <th scope="row">${index + 1}</th>
      <td>${escapeHtml(patient.Id || '-')}</td>
      <td>${escapeHtml(patient.Name || '-')}</td>
      <td>${escapeHtml(patient.Age || '-')}</td>
      <td>${escapeHtml(patient.Mobile || '-')}</td>
      <td>${escapeHtml(patient.Doctor || '-')}</td>
      <td>${formatDate(patient.lmpdate)}</td>
      <td>${formatDate(patient.edddate)}</td>
      <td>${formatDate(patient.cedddate)}</td>
      <td>${escapeHtml(patient.Address || '-')}</td>
      <td><a target="_blank" href="/patients/profile/${encodeURIComponent(patient._id)}">View Profile</a></td>
    `;
    container.appendChild(row);
  });
  count.textContent = `${patients.length} patient${patients.length === 1 ? '' : 's'}`;
}

function searchUpcomingDeliveries() {
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  const loader = document.getElementById('loader');

  if (!startDate || !endDate) {
    alert('Start date and end date are mandatory.');
    return;
  }
  if (startDate > endDate) {
    alert('Start date cannot be after end date.');
    return;
  }

  loader.style.display = 'block';
  fetch(`/patients/upcoming-deliveries/search?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`, {
    credentials: 'same-origin'
  })
    .then(response => response.json().then(data => ({ ok: response.ok, data })))
    .then(result => {
      if (!result.ok) {
        throw new Error(result.data.message || 'Unable to fetch upcoming deliveries.');
      }
      renderDeliveries(result.data.patients || []);
    })
    .catch(error => {
      document.getElementById('tableBody').innerHTML = `<tr><td colspan="11" class="text-center text-danger">${escapeHtml(error.message)}</td></tr>`;
      document.getElementById('deliveryCount').textContent = '';
    })
    .finally(() => {
      loader.style.display = 'none';
    });
}

document.getElementById('searchDeliveriesBtn').addEventListener('click', searchUpcomingDeliveries);
setDefaultDeliveryDates();
searchUpcomingDeliveries();

