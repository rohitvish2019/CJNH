function setPriceAndNotes(){
    let name = document.getElementById('Item').value;
    $.ajax({
        url:'/reports/getServiceByName/',
        type:'Get',
        data:{
            name
        },
        success:function(data){
            document.getElementById('Price').value = data.service.Price == undefined ?'':data.service.Price
            document.getElementById('Notes').value = data.service.Price == undefined ?'':data.service.Notes
        },
        error:function(err){}
    }) 
}
let Items = new Array();
let counter = 0
function addItems(){
    
    let container = document.getElementById('itemsTableBody');
    let itemName = document.getElementById('Item').value
    let itemPrice = document.getElementById('Price').value
    let quantity = document.getElementById('Quantity').value
    let Notes = document.getElementById('Notes').value == undefined ? '':document.getElementById('Notes').value
    let rowItem = document.createElement('tr');
    rowItem.innerHTML=
    `
        <tr>
            <td>${++counter}</td>
            <td>${itemName}</td>
            <td>${itemPrice}</td>
            <td>${quantity}</td>
            <td>${Notes}</td>
            <td>delete</td>
        </tr>
    `
    container.appendChild(rowItem)
    Items.push(itemName+'$'+quantity+'$'+itemPrice+'$'+Notes);
    document.getElementById('Item').value=''
    document.getElementById('Price').value=''
}


function saveBill(){
    let id = document.getElementById('patientId').value;
    let patient = {
        Name : document.getElementById('patName').value,
        Age : document.getElementById('age').value,
        Gender : document.getElementById('gender').value,
        Address : document.getElementById('address').value,
        Mobile : document.getElementById('mobile').value,
        Doctor : document.getElementById('docName').value,
    }
    $.ajax({
        url:'/sales/saveBill',
        type:'Post',
        data:{
            Items,
            patient,
            id
        },
        success:function(data){
            window.open('/sales/bill/pathology')
            window.location.href='/sales/bill/view/'+data.Bill_id
        },
        error:function(err){}
    })
}

function autoFillPatients(){
    let id = document.getElementById('patientId').value
    $.ajax({
        url:'/patients/getPatientById/'+id,
        type:'Get',
        success:function(data){
            
            document.getElementById('patName').value=data.patient.Name;
            document.getElementById('age').value=data.patient.Age;
            document.getElementById('gender').value=data.patient.Gender;
            document.getElementById('address').value=data.patient.Address;
            document.getElementById('mobile').value=data.patient.Mobile;
            document.getElementById('docName').value=data.patient.Doctor;
            new Noty({
                theme: 'relax',
                text: 'Patient setup done',
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
        },
        error:function(data){
            document.getElementById('patName').value='';
            document.getElementById('age').value='';
            document.getElementById('gender').value='';
            document.getElementById('address').value='';
            document.getElementById('mobile').value='';
            document.getElementById('docName').value='';
            document.getElementById('patientId').value=''
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