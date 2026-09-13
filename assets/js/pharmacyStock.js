let stockRows = [];

function addStockRow() {
    const name = document.getElementById('Item').value.trim();
    const batchNumber = document.getElementById('Batch').value.trim();
    const expiryDate = document.getElementById('ExpiryDate').value;
    const purchasePrice = Number(document.getElementById('PurchasePrice').value || 0);
    const sellingPrice = Number(document.getElementById('SellingPrice').value || 0);
    const quantity = Number(document.getElementById('Quantity').value);
    const supplier = document.getElementById('Supplier').value.trim();
    const category = document.getElementById('Category').value;

    if (!name || !Number.isFinite(quantity) || quantity <= 0) {
        new Noty({text: 'Medicine name and a positive quantity are required', type: 'error', layout: 'topRight', timeout: 1500}).show();
        return;
    }

    stockRows.push({name, batchNumber, expiryDate, purchasePrice, sellingPrice, quantity, supplier, category});
    renderStockRows();
    ['Item', 'Batch', 'ExpiryDate', 'PurchasePrice', 'SellingPrice', 'Quantity', 'Supplier'].forEach(id => {
        document.getElementById(id).value = '';
    });
}

function renderStockRows() {
    const container = document.getElementById('prescriptionTableBody');
    container.innerHTML = '';
    stockRows.forEach((stock, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td><td>${stock.name}</td><td>${stock.batchNumber || '-'}</td>
            <td>${stock.expiryDate || '-'}</td><td>${stock.purchasePrice}</td><td>${stock.sellingPrice}</td>
            <td>${stock.quantity}</td><td>${stock.supplier || '-'}</td><td>${stock.category}</td>
            <td><button type="button" class="btn btn-danger btn-sm" onclick="removeStockRow(${index})"><i class="fa-solid fa-trash-can"></i></button></td>
        `;
        container.appendChild(row);
    });
}

function removeStockRow(index) {
    stockRows.splice(index, 1);
    renderStockRows();
}

async function saveStock() {
    if (!stockRows.length) {
        new Noty({text: 'Add at least one stock item', type: 'error', layout: 'topRight', timeout: 1500}).show();
        return;
    }

    try {
        for (const stock of stockRows) {
            const response = await fetch('/pharmacy/stock', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(stock)
            });
            if (!response.ok) {
                throw new Error('Unable to add stock');
            }
        }
        new Noty({text: 'Stock added successfully', type: 'success', layout: 'topRight', timeout: 1500}).show();
        stockRows = [];
        renderStockRows();
    } catch (error) {
        new Noty({text: error.message, type: 'error', layout: 'topRight', timeout: 1500}).show();
    }
}
