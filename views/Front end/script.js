document.getElementById('add-visit').addEventListener('click', function() {
    const visitContainer = document.getElementById('visit-container');
    const newVisit = document.createElement('div');
    newVisit.className = 'card mb-4';
    newVisit.innerHTML = `
        <div class="card-header bg-success text-white">
            <h2 class="h5 mb-0"><i class="fas fa-calendar-alt"></i> Visit Date: <input type="date" class="form-control d-inline-block w-auto" value="${new Date().toISOString().split('T')[0]}"></h2>
        </div>
        <div class="card-body">
            <p><i class="fas fa-stethoscope"></i> <strong>Complaint:</strong> <input type="text" class="form-control"></p>
            <div class="table-responsive">
                <h5>Test Results</h5>
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Test Name</th>
                            <th>Test Results</th>
                            <th>Reference Range</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input type="text" class="form-control"></td>
                            <td><input type="text" class="form-control"></td>
                            <td><input type="text" class="form-control"></td>
                        </tr>

                    </tbody>
                </table>
            </div>
            <div class="table-responsive">
                <h5>Prescribed Medicines</h5>
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Duration</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input type="text" class="form-control"></td>
                            <td><input type="text" class="form-control"></td>
                            <td><input type="text" class="form-control"></td>
                        </tr>

                    </tbody>
                </table>
            </div>
            <p><i class="fas fa-notes-medical"></i> <strong>Doctor's Advice:</strong> <input type="text" class="form-control"></p>
        </div>
    `;
    visitContainer.appendChild(newVisit);
});
