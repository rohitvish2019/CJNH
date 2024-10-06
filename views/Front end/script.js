document.getElementById('add-visit').addEventListener('click', function() {
    const visitContainer = document.getElementById('visit-container');
    const newVisit = document.createElement('div');
    newVisit.className = 'card mb-4';
    newVisit.innerHTML = `
        <div class="card-header  text-white">
            <h2 class="h5 mb-0"><i class="fas fa-calendar-alt"></i> Visit Date: <input type="date" class="form-control d-inline-block w-auto" value="${new Date().toISOString().split('T')[0]}"></h2>
        </div>
        <div class="card-body">
            <p><i class="fas fa-stethoscope"></i> <strong>Complaint:</strong> <input type="text" class="form-control"></p>
            <p><i class="fas fa-vial"></i> <strong>Test Results:</strong> <input type="text" class="form-control"></p>
            <p><i class="fas fa-pills"></i> <strong>Prescribed Medicines:</strong> <input type="text" class="form-control"></p>
            <p><i class="fas fa-notes-medical"></i> <strong>Doctor's Advice:</strong> <input type="text" class="form-control"></p>
        </div>
    `;
    visitContainer.appendChild(newVisit);
});
