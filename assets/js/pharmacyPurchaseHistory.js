const historySearch = document.getElementById('historySearch');
const historyBody = document.getElementById('pharmacyPurchases');
const totalElement = document.getElementById('total');

function escapeHtml(value) {
    const container = document.createElement('div');
    container.textContent = value == null ? '' : value;
    return container.innerHTML;
}

function formatDate(value) {
    if (!value) return '-';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-IN');
}

function renderHistory(purchases) {
    if (!purchases.length) {
        historyBody.innerHTML = '<tr><td colspan="11">No pharmacy purchases found.</td></tr>';
        totalElement.textContent = 'Total: 0';
        return;
    }

    let total = 0;
    historyBody.innerHTML = purchases.map((purchase, index) => {
        const quantity = Number(purchase.quantity || 0);
        const price = Number(purchase.purchasePrice || 0);
        total += quantity * price;
        return `<tr>
            <td>${index + 1}</td>
            <td>${escapeHtml(purchase.name)}</td>
            <td>${escapeHtml(purchase.batchNumber || '-')}</td>
            <td>${formatDate(purchase.expiryDate)}</td>
            <td>${price}</td>
            <td>${Number(purchase.sellingPrice || 0)}</td>
            <td>${quantity}</td>
            <td>${quantity * price}</td>
            <td>${formatDate(purchase.purchasedDate)}</td>
            <td>${escapeHtml(purchase.supplier || '-')}</td>
            <td>${escapeHtml(purchase.category || '-')}</td>
        </tr>`;
    }).join('');
    totalElement.textContent = `Total: ${total}`;
}

async function searchHistory(event) {
    event.preventDefault();
    const params = new URLSearchParams({
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        name: document.getElementById('medicineName').value,
        supplier: document.getElementById('supplier').value
    });
    try {
        const response = await fetch(`/pharmacy/purchase-history/search?${params}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Unable to load purchase history');
        renderHistory(data.purchases);
    } catch (error) {
        historyBody.innerHTML = `<tr><td colspan="11">${escapeHtml(error.message)}</td></tr>`;
        totalElement.textContent = '';
    }
}

historySearch.addEventListener('submit', searchHistory);

const today = new Date();
const monthAgo = new Date(today);
monthAgo.setMonth(monthAgo.getMonth() - 1);
document.getElementById('startDate').value = monthAgo.toISOString().slice(0, 10);
document.getElementById('endDate').value = today.toISOString().slice(0, 10);
historySearch.dispatchEvent(new Event('submit'));
