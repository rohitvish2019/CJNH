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
    let Category = document.getElementById('Category').value
    let date = document.getElementById('Date').value
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
    purchases.push(Item+'$'+Batch+'$'+Price+'$'+Quantity+'$'+SellerName+'$'+Category+'$'+date);
    rowItem.id = countTracker + '_items'
    rowItem.innerHTML=
    `
        <td>${countTracker}</td>
        <td>${Item}</td>
        <td>${Batch}</td>
        <td>${date}</td>
        <td>${Price}</td>
        <td>${Quantity}</td>
        <td>${Price * Quantity}</td>
        <td>${SellerName}</td>
        <td>${Category}</td>
        <td>
            <span id="dustbinDark${countTracker}" onmouseover = "highlight(${countTracker})" onmouseout = "unhighlight(${countTracker})" style="display:inline-block; margin: 1%;" onclick='removeItem(${countTracker})'><i class="fa-solid fa-trash-can"></i> </span>
            <span id="dustbinLight${countTracker}" onmouseover = "highlight(${countTracker})" onmouseout = "unhighlight(${countTracker})" style="display:none; margin: 1%;" onclick='removeItem(${countTracker})'><i class="fa-regular fa-trash-can"></i> </span>
        </td>
    `
    container.appendChild(rowItem);
    countTracker++
    document.getElementById('Item').value=''
    document.getElementById('Batch').value=''
    document.getElementById('Price').value=''
    document.getElementById('Quantity').value=''
    document.getElementById('SellerName').value=''
}
function unhighlight(x) {
    document.getElementById('dustbinDark'+x).style.display = "block";
    document.getElementById('dustbinLight'+x).style.display = "none";
}

function highlight(x) {
    document.getElementById('dustbinDark'+x).style.display = "none";
    document.getElementById('dustbinLight'+x).style.display = "block";
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