let countTracker = 1;
const purchases = new Array();
function addMedications(){
    let listToSave = ['Item','Batch','Price','ExpDate','Quantity']
    let container = document.getElementById('prescriptionTableBody');
    let rowItem = document.createElement('tr');
    let Item = document.getElementById('Item').value
    let Batch = document.getElementById('Batch').value
    let Price = document.getElementById('Price').value
    let ExpiryDate = document.getElementById('ExpiryDate').value
    let Quantity = document.getElementById('Quantity').value
    purchases.push(Item+'$'+Batch+'$'+Price+'$'+ExpiryDate+'$'+Quantity); 
    rowItem.innerHTML=
    `
        <td>${countTracker}</td>
        <td>${Item}</td>
        <td>${Batch}</td>
        <td>${Price}</td>
        <td>${ExpiryDate}</td>
        <td>${Quantity}</td>
        <td>${Price * Quantity}</td>
    `
    container.appendChild(rowItem);
    countTracker++
}

function savePurchases(){
    console.log(purchases);
    $.ajax({
        url:'/purchases/save',
        data:{
            purchases
        },
        type:'Post',
        success:function(data){
            document.getElementById('prescriptionTableBody').innerHTML=``;
            new Noty({
                theme: 'relax',
                text: data.message,
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
        },
        error:function(err){}
    })
        
}