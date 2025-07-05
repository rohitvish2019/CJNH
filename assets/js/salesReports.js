const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
function changeInputs(){
    let value = 'byDateRange';
    /*
    let value = document.getElementById('filterType').value
    if(value == 'byDate'){
        document.getElementById('dateRangeInputs').style.display='none'
        document.getElementById('dateInput').style.display='block'
    }else if (value == 'byDateRange'){
        document.getElementById('dateInput').style.display='none'
        document.getElementById('dateRangeInputs').style.display='block'
    }
        */
}
changeInputs();

function getSalesHistoryDate(){
    let selectedDate = document.getElementById('selectedDate').value
    let BillType = document.getElementById('billType').value
    let Doctor = document.getElementById('Doctor').value
    if(!selectedDate || selectedDate == null || selectedDate == ''){
        new Noty({
            theme: 'relax',
            text: 'Date is mandatory',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    document.getElementById('loader').style.display='block'
    $.ajax({
        url:'/sales/reports/getHistoryByDate',
        type:'Get',
        data:{
            selectedDate,
            BillType,
            Doctor
        },
        success:function(data){
            document.getElementById('loader').style.display='none'
            showHistory(data.billsList)

        },
        error:function(err){
            document.getElementById('loader').style.display='none'
            console.log(err)}
    })
}

function getSalesHistory(){
    getSalesHistoryRange()
    /*
    let value = document.getElementById('filterType').value
    if(value == 'byDate'){
        getSalesHistoryDate()
    }else if (value == 'byDateRange'){
        getSalesHistoryRange()
    }
        */
}

function getSalesHistoryRange(){
    let startDate = document.getElementById('startDate').value
    let endDate = document.getElementById('endDate').value
    let BillType = document.getElementById('billType').value
    let Doctor = document.getElementById('Doctor').value
    if(!startDate || startDate == null || startDate == ''){
        new Noty({
            theme: 'relax',
            text: 'Start date is mandatory',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    if(!endDate || endDate == null || endDate == ''){
        new Noty({
            theme: 'relax',
            text: 'End date is mandatory',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    if(startDate > endDate){
        new Noty({
            theme: 'relax',
            text: 'Start date is greater than end date',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    let days = (new Date(endDate).getTime() - new Date(startDate).getTime())/(60*24*60*1000)
    if( days > 1095){
        new Noty({
            theme: 'relax',
            text: 'Max 3 year allowed',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    document.getElementById('loader').style.display='block'
    $.ajax({
        url:'/sales/reports/getHistoryByRange',
        type:'Get',
        data:{
            startDate,
            endDate,
            BillType,
            Doctor
        },
        success:function(data){
            document.getElementById('loader').style.display='none'
            showHistory(data.billsList, Doctor)
        },
        error:function(err){
            document.getElementById('loader').style.display='none'
            console.log(err)}
    })
}

function showHistory(items, Doctor){
    if(items.length < 1){
        document.getElementById("historyBody").innerHTML=
        `
        <tr>
            <td rowspan="3" colspan="11" style="text-align: center;">No Data found</td>
        </tr>
        `
        document.getElementById('tvalue').innerText='Total Amount : ₹ 0'
        document.getElementById('doctorName').innerText='Doctor :  '+Doctor
        return
    }
    let total = 0
    let cashTotal = 0
    let onlineTotal = 0
    let container = document.getElementById('historyBody');
    
    container.innerHTML=``;
    let finalTotal = 0;
    for(let i=0;i<items.length;i++){
        let rowItem = document.createElement('tr');
        rowItem.id=items[i]._id+'row'
        let appointmentFees = items[i].Appointment == undefined ? 0 : parseInt(items[i].Appointment);
        let pathologyFees = items[i].Pathology == undefined ? 0 : parseInt(items[i].Pathology);
        let dischargeBillFees = items[i].DischargeBill == undefined ? 0 : parseInt(items[i].DischargeBill);
        let ultrasoundFees = items[i].Ultrasound == undefined ? 0 : parseInt(items[i].Ultrasound);
        let iPDAdvanceFees = items[i].IPDAdvance == undefined ? 0 : parseInt(items[i].IPDAdvance);
        let otherFees = items[i].Other == undefined ? 0 : parseInt(items[i].Other);
        let total = appointmentFees + pathologyFees + dischargeBillFees + ultrasoundFees + iPDAdvanceFees + otherFees;
        finalTotal = finalTotal + total;
        rowItem.innerHTML=
        `
            <td>${i+1}</td>
            <td>${items[i].date.split('-')[2]}-${items[i].date.split('-')[1]}-${items[i].date.split('-')[0]}</td>
            <td>₹ ${appointmentFees}</td>
            <td>₹ ${pathologyFees}</td>
            <td>₹ ${dischargeBillFees}</td>
            <td>₹ ${ultrasoundFees}</td>
            <td>₹ ${iPDAdvanceFees}</td>
            <td>₹ ${otherFees}</td> 
            <td>₹ ${total}</td> 
        `
        
        
        container.appendChild(rowItem);
        total = total  + +items[i].Total
        cashTotal = cashTotal + +items[i].CashPaid
        onlineTotal = onlineTotal + +items[i].OnlinePaid
    }
    /*
    if(document.getElementById('printSelected') == null || document.getElementById('printSelected') == undefined) {
        let printButton = document.createElement('button')
        printButton.innerText='Print'
        printButton.id='printSelected'
        printButton.classList.add('btn')
        printButton.classList.add('btn-primary')
        printButton.addEventListener('click', printMe);
        document.getElementById('main-body').appendChild(printButton);
    }
        */  
    
    document.getElementById('tvalue').innerText='Total : ₹ '+finalTotal
    document.getElementById('doctorName').innerText='Doctor :  '+Doctor
    
    
}

/*
function cancelSale(id){
    let confirmation = window.confirm('Sales will be cancelled permantly');
    if(confirmation){
        $.ajax({
            url:'/sales/cancel',
            type:'Delete',
            data:{
                saleId: id
            },
            success:function(data){
                document.getElementById(id+'row').remove()
                document.getElementById('tvalue').innerText=''
            },
            error:function(err){
                new Noty({
                    theme: 'relax',
                    text: 'Unable to cancel sale',
                    type: 'error',
                    layout: 'topRight',
                    timeout: 1500
                }).show();
                return
            }
    
        })
    }
    
}
    */
function printMe(){
    document.getElementById('header').style.display='none'
    //document.getElementById('searchElements').style.display='none'
    let buttons = document.getElementsByClassName('btn');
    for(let i=0;i<buttons.length;i++){
        buttons[i].style.display='none'
    }
    let inputs = document.getElementsByTagName('input');
    for(let i=0;i<inputs.length;i++){
        if(inputs[i].type != 'date'){
            inputs[i].style.display='none'
        }
        
    }

    let selects = document.getElementsByTagName('select');
    for(let i=0;i<selects.length;i++){
        if(selects[i].id != 'billType') {
            selects[i].style.display='none'
        }
        
    }
    let otherItems = document.getElementsByClassName('toBeRemovedinPDF');
    for(let i=0;i<otherItems.length;i++){
        otherItems[i].style.display='none'
    }
    window.print()
}
/*
function changePaymentMode(id, Total){
    console.log(id + ":::::" + Total)
    let newPaymentMethod = window.prompt("Payment method : enter O for online and C for cash")
    if(newPaymentMethod == 'O' || newPaymentMethod == 'o'){
        newPaymentMethod = "Online"
    } else if (newPaymentMethod == 'C' || newPaymentMethod == 'c') {
        newPaymentMethod = "Cash"
    }
    $.ajax({
        url:'/sales/changePayment',
        data:{
            id,
            newPaymentMethod,
            Total
        },
        type:'POST',
        success:function(data){},
        error:function(err){}
    })
}
    */