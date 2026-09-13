const searchForm = document.getElementById('stockSearchForm');
const medicineSearch = document.getElementById('medicineSearch');
const stockResults = document.getElementById('stockResults');
const stockMessage = document.getElementById('stockMessage');

function showMessage(message, type = 'info') {
    stockMessage.className = `stock-message alert alert-${type}`;
    stockMessage.textContent = message;
}

function escapeHtml(value) {
    const container = document.createElement('div');
    container.textContent = value == null ? '' : value;
    return container.innerHTML;
}

function formatDate(value) {
    if (!value) return '-';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString('en-IN');
}

function renderResults(medicines) {
    if (!medicines.length) {
        stockResults.innerHTML = '<tr><td colspan="8" class="text-center">No stock found for this medicine.</td></tr>';
        return;
    }

    stockResults.innerHTML = medicines.map((medicine, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${escapeHtml(medicine.name)}</td>
            <td>${escapeHtml(medicine.batchNumber || '-')}</td>
            <td>${formatDate(medicine.expiryDate)}</td>
            <td>${medicine.purchasePrice}</td>
            <td>${medicine.sellingPrice}</td>
            <td id="quantity-${medicine._id}">${medicine.quantity}</td>
            <td>
                <form class="add-stock-form" data-id="${medicine._id}">
                    <input class="form-control" type="number" min="1" step="1" name="quantity" placeholder="Qty" required>
                    <button class="btn btn-primary btn-sm" type="submit">Add</button>
                </form>
            </td>
        </tr>
    `).join('');

    stockResults.querySelectorAll('.add-stock-form').forEach(form => {
        form.addEventListener('submit', addStockToBatch);
    });
}

async function searchStock(event) {
    event.preventDefault();
    const name = medicineSearch.value.trim();
    if (!name) return;

    stockMessage.className = 'stock-message';
    stockMessage.textContent = 'Searching...';
    try {
        const response = await fetch(`/pharmacy/manage-stock/search?name=${encodeURIComponent(name)}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Unable to search stock');
        renderResults(data.medicines);
    } catch (error) {
        stockResults.innerHTML = '';
        showMessage(error.message, 'danger');
    }
}

async function addStockToBatch(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const quantityInput = form.elements.quantity;
    const quantity = Number(quantityInput.value);
    if (!Number.isInteger(quantity) || quantity < 1) return;

    try {
        const response = await fetch(`/pharmacy/manage-stock/${form.dataset.id}/add`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({quantity})
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Unable to add stock');
        document.getElementById(`quantity-${form.dataset.id}`).textContent = data.medicine.quantity;
        quantityInput.value = '';
        showMessage('Stock added successfully', 'success');
    } catch (error) {
        showMessage(error.message, 'danger');
    }
}

searchForm.addEventListener('submit', searchStock);
