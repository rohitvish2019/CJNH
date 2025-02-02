let counter = 1
let total = 0
function SaveDischargeBill(){
    if(document.getElementById('printButton')){
        document.getElementById('printButton').setAttribute('disabled', 'true')
    }
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
        url:'/patients/saveDischargeBill',
        data:{
            visitId : document.getElementById('visitId').value,
            dischargeItems,
            cashPayment,
            onlinePayment
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
        <td><input id='${itemName}newItem_p' onchange='saveChanges(${itemName}newItem)' value = '${itemPrice}'></td>
        <td>
            <span id="dustbinDark${counter}" onmouseover = "highlight(${counter})" onmouseout = "unhighlight(${counter})" style="display:inline-block; margin: 1%;" onclick='deleteItems("${itemName+'newItem'}")'"><i class="fa-solid fa-trash-can"></i> </span>
            <span id="dustbinLight${counter}" onmouseover = "highlight(${counter})" onmouseout = "unhighlight(${counter})" style="display:none; margin: 1%;" onclick='deleteItems("${itemName+'newItem'}")'"><i class="fa-regular fa-trash-can"></i> </span>
        </td>
    `
    document.getElementById('billingDetails').appendChild(rowItem);
    total = total + parseInt(item.Price)
    document.getElementById('total').innerText='Total :'+total
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
                    <td><input id='${data.Items[i]._id}_p' type='number' onchange=saveChanges('${data.Items[i]._id}') value='${data.Items[i].Price}'></td>
                    <td>
                        <span id="dustbinDark${counter}" onmouseover = "highlight(${counter})" onmouseout = "unhighlight(${counter})" style="display:inline-block; margin: 1%;" onclick='deleteItems("${data.Items[i]._id}")'"><i class="fa-solid fa-trash-can"></i> </span>
                        <span id="dustbinLight${counter}" onmouseover = "highlight(${counter})" onmouseout = "unhighlight(${counter})" style="display:none; margin: 1%;" onclick='deleteItems("${data.Items[i]._id}")'"><i class="fa-regular fa-trash-can"></i> </span>
                    </td>
                `
                container.appendChild(rowItem);
                dischargeItems[data.Items[i]._id] = data.Items[i]
                total = total + data.Items[i].Price
            }
            let rooRentRow = document.createElement('tr');
            rooRentRow.id = 'roomRent'
            rooRentRow.innerHTML=
            `
                <td>${counter}</td>
                <td style="text-align: left;">Room rent (for ${data.daysCount} days)</td>
                <td><input id='roomRent_p' type='number' onchange=saveChanges('roomRent') value='${data.daysCount * data.roomRent}'></td>
                <td>
                
                <span id="dustbinDark${counter}" onmouseover = "highlight(${counter})" onmouseout = "unhighlight(${counter})" style="display:inline-block; margin: 1%;" onclick='deleteItems("roomRent")'"><i class="fa-solid fa-trash-can"></i> </span>
                <span id="dustbinLight${counter}" onmouseover = "highlight(${counter})" onmouseout = "unhighlight(${counter})" style="display:none; margin: 1%;" onclick='deleteItems("roomRent")'"><i class="fa-regular fa-trash-can"></i> </span>
                </td>
            `
            container.appendChild(rooRentRow)
            let roomItemName = 'Room rent (for '+ data.daysCount + ') days'
            dischargeItems['roomRent'] = {"Name":roomItemName,"Price":data.daysCount*data.roomRent}
            total = total + data.daysCount*data.roomRent
            for(i=0;i<data.advancedPayments.length;i++){
                let item = data.advancedPayments[i].split('$');
                let rowItem = document.createElement('tr');
                rowItem.id = item.toString();
                rowItem.innerHTML=
                `
                    <td>${counter++}</td>
                    <td style="text-align: left;">${item[0]} (${item[2]})</td>
                    <td><input readonly type='number' value=${item[1]}></td>
                    <td>
                        <span id="dustbinDark${counter}" onmouseover = "highlight(${counter})" onmouseout = "unhighlight(${counter})" style="display:inline-block; margin: 1%;" onclick='deleteItems("${item.toString()}")'"><i class="fa-solid fa-trash-can"></i> </span>
                        <span id="dustbinLight${counter}" onmouseover = "highlight(${counter})" onmouseout = "unhighlight(${counter})" style="display:none; margin: 1%;" onclick='deleteItems("${item.toString()}")'"><i class="fa-regular fa-trash-can"></i> </span>
                    </td>
                `
                container.appendChild(rowItem);
                total = total + parseInt(item[1]);
                
                dischargeItems[item.toString()] = {"Name":item[0]+' on ' +item[2],"Price":item[1]}
            }
            document.getElementById('total').innerText='Total :'+total
        },
        error:function(err){}
    })
}
function deleteItems(id){
    document.getElementById(id).remove();
    let price = dischargeItems[id].Price;
    total = total - price
    delete dischargeItems[id]
    document.getElementById('total').innerText='Total :'+total
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

function saveChanges(id){
    let oldPrice = dischargeItems[id].Price
    let newPrice = parseInt(document.getElementById(id+'_p').value)
    dischargeItems[id].Price = parseInt(document.getElementById(id+'_p').value)
    total = total + newPrice - oldPrice
    document.getElementById('total').innerText='Total :'+total
}

function setuppayments(){
    let cash = parseInt(document.getElementById('cashPayment').value);
    document.getElementById('onlinePayment').value = total - cash
}

function numberToWords(num) {
    if (typeof num !== 'number' || isNaN(num)) return "Invalid input";
    if (num === 0) return "zero";

    const belowTwenty = [
        "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
        "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"
    ];
    const tens = [
        "", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"
    ];
    const thousands = ["", "thousand", "million", "billion", "trillion"];

    function helper(n) {
        if (n === 0) return "";
        if (n < 20) return belowTwenty[n - 1] + " ";
        if (n < 100) return tens[Math.floor(n / 10)] + " " + helper(n % 10);
        if (n < 1000) return belowTwenty[Math.floor(n / 100) - 1] + " hundred " + helper(n % 100);
        return "";
    }

    function convertDecimals(decimals) {
        return decimals.split('').map(digit => belowTwenty[parseInt(digit) - 1]).join(" ");
    }

    if (num < 0) return "negative " + numberToWords(Math.abs(num));

    let word = "";
    let i = 0;

    while (num >= 1) {
        const chunk = num % 1000;
        if (chunk > 0) {
            word = helper(chunk) + thousands[i] + " " + word;
        }
        num = Math.floor(num / 1000);
        i++;
    }

    if (num.toString().includes('.')) {
        const [whole, fraction] = num.toString().split('.');
        return numberToWords(parseInt(whole)) + " point " + convertDecimals(fraction);
    }

    return word.trim();
}

function convertUTCToIST(utcDateTimeStr) {
    // Parse the UTC datetime string to a Date object
    const utcDate = new Date(utcDateTimeStr);

    // Get the UTC time in milliseconds and add the IST offset (5 hours 30 minutes in milliseconds)
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const istDate = new Date(utcDate.getTime() + istOffset);

    // Format the IST date to ISO string with time zone offset
    return istDate.toISOString().replace('Z', '+05:30');
}
