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
  const startDate = new Date(today);
  const endDate = new Date(today);
  startDate.setDate(startDate.getDate() - 7);
  endDate.setDate(endDate.getDate() + 7);
  document.getElementById('startDate').value = localDateString(startDate);
  document.getElementById('endDate').value = localDateString(endDate);
}

function renderDeliveries(patients) {
  const container = document.getElementById('tableBody');
  const count = document.getElementById('deliveryCount');
  const deliveredCount = document.getElementById('deliveredCount');
  const pendingCount = document.getElementById('pendingCount');
  const dueCount = document.getElementById('dueCount');
  container.innerHTML = '';

  let delivered = 0;
  let pending = 0;
  let due = 0;

  if (!patients.length) {
    container.innerHTML = '<tr><td colspan="10" class="text-center">No upcoming deliveries found for the selected dates.</td></tr>';
    count.textContent = '0 patients';
    deliveredCount.textContent = '0';
    pendingCount.textContent = '0';
    dueCount.textContent = '0';
    return;
  }

  patients.forEach((patient, index) => {
    const row = document.createElement('tr');
    const hasBirthCertificate = patient.hasValidBirthCertificate === true || patient.birthCertificateStatus === 'Yes';
    let deliveryStatus = 'Unknown';

    if (hasBirthCertificate) {
      deliveryStatus = 'Delivered';
      delivered += 1;
      row.style.backgroundColor = '#d4edda';
    } else if (patient.cedddate) {
      const ceddDate = new Date(`${patient.cedddate}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (ceddDate < today) {
        deliveryStatus = 'Pending';
        pending += 1;
        row.style.backgroundColor = '#f8d7da';
      } else {
        deliveryStatus = 'Due';
        due += 1;
      }
    } else {
      deliveryStatus = 'Due';
      due += 1;
    }

    row.innerHTML = `
      <th scope="row">${index + 1}</th>
      <td>${escapeHtml(patient.Id || '-')}</td>
      <td>${escapeHtml(patient.Name || '-')}</td>
      <td>${escapeHtml(patient.Age || '-')}</td>
      <td>${escapeHtml(patient.Mobile || '-')}</td>
      <td>${escapeHtml(patient.Doctor || '-')}</td>
      <td>${formatDate(patient.cedddate)}</td>
      <td>${deliveryStatus}</td>
      <td>${escapeHtml(patient.Address || '-')}</td>
      <td><a target="_blank" href="/patients/profile/${encodeURIComponent(patient._id)}">View Profile</a></td>
    `;

    const cells = row.querySelectorAll('td, th');
    if (row.style.backgroundColor) {
      cells.forEach(cell => {
        cell.style.backgroundColor = row.style.backgroundColor;
      });
    }

    container.appendChild(row);
  });

  deliveredCount.textContent = delivered;
  pendingCount.textContent = pending;
  dueCount.textContent = due;
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
      document.getElementById('tableBody').innerHTML = `<tr><td colspan="10" class="text-center text-danger">${escapeHtml(error.message)}</td></tr>`;
      document.getElementById('deliveryCount').textContent = '';
    })
    .finally(() => {
      loader.style.display = 'none';
    });
}

document.getElementById('searchDeliveriesBtn').addEventListener('click', searchUpcomingDeliveries);
setDefaultDeliveryDates();
searchUpcomingDeliveries();

