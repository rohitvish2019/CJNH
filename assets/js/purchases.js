let countTracker = 1;
const purchases = new Array();
function addMedications(){
    let listToSave = ['Item','Batch','Price','Quantity']
    let container = document.getElementById('prescriptionTableBody');
    let rowItem = document.createElement('tr');
    let Item = document.getElementById('Item').value
    let Batch = document.getElementById('Batch').value
    let Price = document.getElementById('Price').value
    let Quantity = document.getElementById('Quantity').value
    let SellerName = document.getElementById('SellerName').value
    if(Item == '' || Quantity == ''){
        new Noty({
            theme: 'relax',
            text: 'Item Name and Quantity are mandatory',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    purchases.push(Item+'$'+Batch+'$'+Price+'$'+Quantity+'$'+SellerName);
    rowItem.id = countTracker + '_items'
    rowItem.innerHTML=
    `
        <td>${countTracker}</td>
        <td>${Item}</td>
        <td>${Batch}</td>
        <td>${Price}</td>
        <td>${Quantity}</td>
        <td>${Price * Quantity}</td>
        <td>${SellerName}</td>
        <td><button onclick='removeItem(${countTracker})'>Delete</button></td>
    `
    container.appendChild(rowItem);
    countTracker++
    document.getElementById('Item').value=''
    document.getElementById('Batch').value=''
    document.getElementById('Price').value=''
    document.getElementById('Quantity').value=''
    document.getElementById('SellerName').value=''
}
function removeItem(counter){
    purchases[counter-1] = '';
    document.getElementById(counter+'_items').remove();
}

function savePurchases(){
    console.log(purchases);
    if(purchases.length < 1){
        new Noty({
            theme: 'relax',
            text: 'Can not save empty purchase',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
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
            setTimeout(function(){window.location.href='/purchases/home'},1300)
            
            
        },
        error:function(err){}
    })
    
}