function setPriceAndNotes() {
    let name = document.getElementById('Item').value;
    $.ajax({
        url: '/reports/getServiceByName/',
        type: 'Get',
        data: {
            name
        },
        success: function (data) {
            document.getElementById('Price').value = data.service.Price == undefined ? '' : data.service.Price
            document.getElementById('Notes').value = data.service.Notes == undefined ? '' : data.service.Notes
            //document.getElementById('Type').value = data.service.Type == undefined ? '' : data.service.Type
        },
        error: function (err) {}
    })
}
let Items = new Array();
let counter = 0
let total = 0
function addItems() {
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
            <td>${quantity}</td>
            <td>${Notes}</td>
            <td>
                <span id="dustbinDark${counter}" onmouseover = "highlight(${counter})" onmouseout = "unhighlight(${counter})" style="display:inline-block; margin: 1%;" onclick="deleteItem(${counter})"><i class="fa-solid fa-trash-can"></i> </span>
                <span id="dustbinLight${counter}" onmouseover = "highlight(${counter})" onmouseout = "unhighlight(${counter})" style="display:none; margin: 1%;" onclick="deleteItem(${counter})"><i class="fa-regular fa-trash-can"></i> </span>
            </td>
        </tr>
    `
    container.appendChild(rowItem)
    Items.push(itemName + '$' + quantity + '$' + itemPrice + '$' + Notes);
    total = total + +itemPrice
    document.getElementById('Item').value = ''
    document.getElementById('Price').value = ''
    document.getElementById('total').innerText = total
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
    let itemPrice = parseInt(document.getElementById('price_'+counter).innerText)
    console.log(itemPrice)
    console.log(typeof(itemPrice))
    total = total - itemPrice
    document.getElementById('rowItem_'+counter).remove()
    document.getElementById('total').innerText = total
}

function saveBill() {
    let id = document.getElementById('patientId').value;
    let idProof=''
    if(document.getElementById('IdProof')){
        idProof = document.getElementById('IdProof').value;
    }
    let patient = {
        Name: document.getElementById('patName').value,
        Age: document.getElementById('age').value,
        Gender: document.getElementById('gender').value,
        Address: document.getElementById('address').value,
        Mobile: document.getElementById('mobile').value,
        Doctor: document.getElementById('docName').value,
        IdProof : idProof
    }
    console.log('TEST')
    console.log(patient)
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

    let paymentMode = window.prompt("Please enter payment mode");
    console.log(paymentMode)
    if(paymentMode == '' || paymentMode == null){
        return;
    }
    $.ajax({
        url: '/sales/saveBill',
        type: 'Post',
        data: {
            Type:document.getElementById('billType').value,
            Items,
            patient,
            Total:total,
            paymentMode,
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
            document.getElementById('docName').value = data.patient.Doctor;
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
            document.getElementById('docName').value = '';
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