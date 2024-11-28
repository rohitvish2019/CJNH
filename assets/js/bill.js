let counter = 1
function SaveDischargeBill(){
    let paymentType = window.prompt('Please enter payment type')
    if(paymentType == null || paymentType == ''){
        return
    }
    $.ajax({
        url:'/patients/saveDischargeBill',
        data:{
            visitId : document.getElementById('visitId').value,
            dischargeItems,
            paymentType
        },
        type:'Post',
        success:function(data){
            window.location.href='/sales/bill/view/'+data.sale
        }
    })
}

function openNewItemPopup(){
    document.getElementById('addNewItem').style.display='block'
}

function closepopup(){
    document.getElementById('addNewItem').style.display='none'
}
let dischargeItems = {};

function addNewItems(){
    let itemName = document.getElementById('itemName').value
    let itemPrice = document.getElementById('itemPrice').value
    let item = {
        'Name':itemName,
        'Price':itemPrice,
    }
    if( itemName == '' || itemPrice == ''){
        new Noty({
            theme: 'relax',
            text: 'Empty values are not allowed',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
    }
    
    dischargeItems[itemName+'newItem'] = item;
    let rowItem = document.createElement('tr');
    rowItem.id= itemName+'newItem';
    rowItem.innerHTML=
    `
        <td>${counter++}</td>
        <td style="text-align: left;">${itemName}</td>
        <td>₹${itemPrice}</td>
        <td onclick='deleteItems("${itemName+'newItem'}")'><button>Delete</button></td>
        <td>
            <span id="dustbinDark${counter}" onmouseover = "highlight(${counter})" onmouseout = "unhighlight(${counter})" style="display:inline-block; margin: 1%;" onclick='deleteItems("${itemName+'newItem'}")'"><i class="fa-solid fa-trash-can"></i> </span>
            <span id="dustbinLight${counter}" onmouseover = "highlight(${counter})" onmouseout = "unhighlight(${counter})" style="display:none; margin: 1%;" onclick='deleteItems("${itemName+'newItem'}")'"><i class="fa-regular fa-trash-can"></i> </span>
        </td>
    `
    document.getElementById('billingDetails').appendChild(rowItem);
    closepopup()
}
function getDischargeBillItems(){
    let visitid = document.getElementById('visitId').value
    $.ajax({
        url:'/patients/getDischargeBillItems',
        type:'GET',
        data:{
            visitid
        },
        success:function(data){
            let container = document.getElementById('billingDetails');
            container.innerHTML=``
            
            for(let i=0;i<data.Items.length;i++){
                let rowItem = document.createElement('tr');
                rowItem.id = data.Items[i]._id
                rowItem.innerHTML=
                `
                    <td>${counter++}</td>
                    <td style="text-align: left;">${data.Items[i].Name}</td>
                    <td>₹${data.Items[i].Price}</td>
                    <td>
                        <span id="dustbinDark${counter}" onmouseover = "highlight(${counter})" onmouseout = "unhighlight(${counter})" style="display:inline-block; margin: 1%;" onclick='deleteItems("${data.Items[i]._id}")'"><i class="fa-solid fa-trash-can"></i> </span>
                        <span id="dustbinLight${counter}" onmouseover = "highlight(${counter})" onmouseout = "unhighlight(${counter})" style="display:none; margin: 1%;" onclick='deleteItems("${data.Items[i]._id}")'"><i class="fa-regular fa-trash-can"></i> </span>
                    </td>
                `
                container.appendChild(rowItem);
                dischargeItems[data.Items[i]._id] = data.Items[i]
            }
            let rooRentRow = document.createElement('tr');
            rooRentRow.id = 'roomRent'
            rooRentRow.innerHTML=
            `
                <td>${counter}</td>
                <td style="text-align: left;">Room Rent</td>
                <td>₹${data.daysCount * data.roomRent}</td>
                <td>
                
                <span id="dustbinDark${counter}" onmouseover = "highlight(${counter})" onmouseout = "unhighlight(${counter})" style="display:inline-block; margin: 1%;" onclick='deleteItems("roomRent")'"><i class="fa-solid fa-trash-can"></i> </span>
                <span id="dustbinLight${counter}" onmouseover = "highlight(${counter})" onmouseout = "unhighlight(${counter})" style="display:none; margin: 1%;" onclick='deleteItems("roomRent")'"><i class="fa-regular fa-trash-can"></i> </span>
                </td>
            `
            container.appendChild(rooRentRow)
            dischargeItems['roomRent'] = {"Name":"roomRent","Price":data.daysCount*data.roomRent}

            for(i=0;i<data.advancedPayments.length;i++){
                let item = data.advancedPayments[i].split('$');
                let rowItem = document.createElement('tr');
                rowItem.id = item[0]+item[2]
                rowItem.innerHTML=
                `
                    <td>${counter++}</td>
                    <td style="text-align: left;">${item[0]}</td>
                    <td>₹${item[1]}</td>
                    <td>
                    <span id="dustbinDark${counter}" onmouseover = "highlight(${counter})" onmouseout = "unhighlight(${counter})" style="display:inline-block; margin: 1%;" onclick='deleteItems("${item[0]+item[2]}")'"><i class="fa-solid fa-trash-can"></i> </span>
                    <span id="dustbinLight${counter}" onmouseover = "highlight(${counter})" onmouseout = "unhighlight(${counter})" style="display:none; margin: 1%;" onclick='deleteItems("${item[0]+item[2]}")'"><i class="fa-regular fa-trash-can"></i> </span>
                    </td>
                `
                container.appendChild(rowItem);
                dischargeItems[item[0]+item[2]] = {"Name":item[0],"Price":item[1]}
            }
        },
        error:function(err){}
    })
}
function deleteItems(id){
    document.getElementById(id).remove();
    delete dischargeItems[id]
}

function unhighlight(x) {
    document.getElementById('dustbinDark'+x).style.display = "block";
    document.getElementById('dustbinLight'+x).style.display = "none";
}

function highlight(x) {
    document.getElementById('dustbinDark'+x).style.display = "none";
    document.getElementById('dustbinLight'+x).style.display = "block";
}

getDischargeBillItems();
