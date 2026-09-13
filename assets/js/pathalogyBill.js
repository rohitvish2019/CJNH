function setPriceAndNotes() {
    let name = document.getElementById('Item').value;
    const isPharmacyBilling = document.getElementById('billType').value == 'Pharmacy';
    $.ajax({
        url: isPharmacyBilling ? '/pharmacy/medicine' : '/reports/getServiceByName/',
        type: 'Get',
        data: {
            name
        },
        success: function (data) {
            const price = isPharmacyBilling ? data.medicine.sellingPrice : data.service.Price;
            document.getElementById('Price').value = price == undefined ? '' : price;
            document.getElementById('Notes').value = isPharmacyBilling ? '' : (data.service.Notes == undefined ? '' : data.service.Notes);
            if(isPharmacyBilling){
                window.selectedPharmacyMedicineId = data.medicine._id;
            }
            //document.getElementById('Type').value = data.service.Type == undefined ? '' : data.service.Type
        },
        error: function (err) {}
    })
}
let Items = new Array();
let counter = 0
let total = 0
let patient
let pharmacyItems = []
setDefaultDoctorForBilling();

function setDefaultDoctorForBilling() {
    if(document.getElementById('billType').value == 'Pathology' || document.getElementById('billType').value == 'Ultrasound' || document.getElementById('billType').value == 'Pharmacy'){
        const defaultDoctorName = window.hospitalConfig?.doctors?.[0]?.name || '';
        document.getElementById('docName').value = defaultDoctorName;
    }
}

async function addPharmacyItems() {
    const itemName = document.getElementById('Item').value.trim();
    const quantity = Number(document.getElementById('Quantity').value);
    const notes = document.getElementById('Notes').value == 'undefined' ? '' : document.getElementById('Notes').value;
    if(!itemName || !Number.isInteger(quantity) || quantity < 1){
        new Noty({text: 'Medicine name and a positive whole quantity are required', type: 'error', layout: 'topRight', timeout: 1500}).show();
        return;
    }

    try {
        const response = await fetch(`/pharmacy/allocate?name=${encodeURIComponent(itemName)}&quantity=${quantity}`);
        const data = await response.json();
        if(!response.ok) throw new Error(data.message || 'Unable to allocate medicine stock');

        data.allocations.forEach(allocation => {
            const rowItem = document.createElement('tr');
            rowItem.id = 'rowItem_' + (++counter);
            rowItem.innerHTML = `
                <td>${counter}</td>
                <td>${allocation.name}${allocation.batchNumber ? ' (' + allocation.batchNumber + ')' : ''}</td>
                <td id="price_${counter}">${allocation.sellingPrice}</td>
                <td id="qty_${counter}">${allocation.quantity}</td>
                <td>${notes}</td>
                <td><span onclick="deleteItem(${counter})"><i class="fa-solid fa-trash-can"></i></span></td>
            `;
            document.getElementById('itemsTableBody').appendChild(rowItem);
            Items.push(allocation.name + '$' + allocation.quantity + '$' + allocation.sellingPrice + '$' + notes);
            pharmacyItems[counter - 1] = {medicineId: allocation.medicineId, quantity: allocation.quantity, price: allocation.sellingPrice};
            total += allocation.sellingPrice * allocation.quantity;
        });
        document.getElementById('total').innerText = total;
        document.getElementById('Item').value = '';
        document.getElementById('Price').value = '';
        document.getElementById('Quantity').value = 1;
        document.getElementById('Notes').value = '';
        window.selectedPharmacyMedicineId = null;
    } catch (error) {
        new Noty({text: error.message, type: 'error', layout: 'topRight', timeout: 1500}).show();
    }
}

function addItems() {
    if(document.getElementById('billType').value == 'Pharmacy'){
        addPharmacyItems();
        return;
    }
    let container = document.getElementById('itemsTableBody');
    let itemName = document.getElementById('Item').value
    let itemPrice = document.getElementById('Price').value
    let quantity = document.getElementById('Quantity').value
    let Notes = document.getElementById('Notes').value == 'undefined' ? '' : document.getElementById('Notes').value
    if(!itemName || itemName == '' || !itemPrice || itemPrice == ''){
        new Noty({
            theme: 'relax',
            text: 'Name and price is mandatory',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return 
    }
    let rowItem = document.createElement('tr');
    rowItem.id='rowItem_'+ (counter+1)
    rowItem.innerHTML =
        `
        <tr>
            <td>${++counter}</td>
            <td>${itemName}</td>
            <td id='price_${counter}'>${itemPrice}</td>
            <td id='qty_${counter}'>${quantity}</td>
            <td>${Notes}</td>
            <td>
                <span id="dustbinDark${counter}" onmouseover = "highlight(${counter})" onmouseout = "unhighlight(${counter})" style="display:inline-block; margin: 1%;" onclick="deleteItem(${counter})"><i class="fa-solid fa-trash-can"></i> </span>
                <span id="dustbinLight${counter}" onmouseover = "highlight(${counter})" onmouseout = "unhighlight(${counter})" style="display:none; margin: 1%;" onclick="deleteItem(${counter})"><i class="fa-regular fa-trash-can"></i> </span>
            </td>
        </tr>
    `
    container.appendChild(rowItem)
    Items.push(itemName + '$' + quantity + '$' + itemPrice + '$' + Notes);
    total = total + +itemPrice*quantity
    document.getElementById('Item').value = ''
    document.getElementById('Price').value = ''
    document.getElementById('total').innerText = total
    if(document.getElementById('billType').value == 'Pharmacy'){
        window.selectedPharmacyMedicineId = null;
    }
}

function unhighlight(x) {
    document.getElementById('dustbinDark'+x).style.display = "block";
    document.getElementById('dustbinLight'+x).style.display = "none";
}

function highlight(x) {
    document.getElementById('dustbinDark'+x).style.display = "none";
    document.getElementById('dustbinLight'+x).style.display = "block";
}

function deleteItem(counter){
    console.log('deleting item on position '+ (counter - 1))
    Items.splice(counter-1, 1, '');
    if(document.getElementById('billType').value == 'Pharmacy'){
        pharmacyItems[counter - 1] = null;
    }
    let itemPrice = parseInt(document.getElementById('price_'+counter).innerText)
    let itemQty = parseInt(document.getElementById('qty_'+counter).innerText)
    total = total - itemPrice*itemQty
    document.getElementById('rowItem_'+counter).remove()
    document.getElementById('total').innerText = total
}

function saveBill() {
    document.getElementById('addPayment').setAttribute('disabled', 'true')
    let id = document.getElementById('patientId').value;
    let cashPayment = parseInt(document.getElementById('cashPayment').value)
    let onlinePayment = parseInt(document.getElementById('onlinePayment').value)
    if(cashPayment + onlinePayment != parseInt(total)){
        new Noty({
            theme: 'relax',
            text: 'Total mismatch',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return;
    }
    $.ajax({
        url: '/sales/saveBill',
        type: 'Post',
        data: {
            Type:document.getElementById('billType').value,
            Items,
            PharmacyItems: pharmacyItems.filter(Boolean),
            patient,
            Total:total,
            cashPayment,
            onlinePayment,
            id
        },
        success: function (data) {
            window.open('/sales/bill/view/' + data.Bill_id)
            window.location.reload()
        },
        error: function (err) {}
    })
}


function autoFillPatients() {
    let id = document.getElementById('patientId').value
    $.ajax({
        url: '/patients/getPatientById/' + id,
        type: 'Get',
        success: function (data) {
            document.getElementById('patName').value = data.patient.Name;
            document.getElementById('age').value = data.patient.Age;
            document.getElementById('gender').value = data.patient.Gender;
            document.getElementById('address').value = data.patient.Address;
            document.getElementById('mobile').value = data.patient.Mobile;
            setDefaultDoctorForBilling()
            document.getElementById('IdProof').value = data.patient.IdProof;
            new Noty({
                theme: 'relax',
                text: 'Patient setup done',
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
        },
        error: function (data) {
            document.getElementById('patName').value = '';
            document.getElementById('age').value = '';
            document.getElementById('gender').value = '';
            document.getElementById('address').value = '';
            document.getElementById('mobile').value = '';
            setDefaultDoctorForBilling()
            document.getElementById('patientId').value = ''
            document.getElementById('IdProof').value = '';
            new Noty({
                theme: 'relax',
                text: 'No data found',
                type: 'warning',
                layout: 'topRight',
                timeout: 1500
            }).show();
        }
    })
}

function closePopup(){
    document.getElementById('paymentPoppup').style.display='none'
}

function openPopup(){
    document.getElementById('paymentPoppup').style.display='block'
}

function setuppayments(){
    let cash = parseInt(document.getElementById('cashPayment').value);
    document.getElementById('onlinePayment').value = total - cash
}

function checkValidations(){
    
    let idProof=''
    if(document.getElementById('IdProof')){
        idProof = document.getElementById('IdProof').value;
    }
    patient = {
        Name: document.getElementById('patName').value,
        Age: document.getElementById('age').value,
        Gender: document.getElementById('gender').value,
        Address: document.getElementById('address').value,
        Mobile: document.getElementById('mobile').value,
        Doctor: document.getElementById('docName').value,
        ReferredBy: document.getElementById('referredBy') ? document.getElementById('referredBy').value : '',
        IdProof : idProof
    }
    
    if (patient.Name == '' || patient.Age == '' || patient.Gender == '' || patient.Address == '' || patient.Mobile == '' || patient.Doctor == '') {
        new Noty({
            theme: 'relax',
            text: 'All Patient details are mandatory',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    if (Items.length < 1) {
        new Noty({
            theme: 'relax',
            text: 'Can not save empty report',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }

    openPopup();
    
}
