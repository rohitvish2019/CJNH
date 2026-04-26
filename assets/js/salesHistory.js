const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
function changeInputs(){
    let value = document.getElementById('filterType').value
    if(value == 'byDate'){
        document.getElementById('dateRangeInputs').style.display='none'
        document.getElementById('dateInput').style.display='block'
        document.getElementById('pidInput').style.display='none'
        document.getElementById('selectBillType').style.display='block'
        document.getElementById('selectDoctor').style.display='block'
    }else if (value == 'byDateRange'){
        document.getElementById('dateInput').style.display='none'
        document.getElementById('dateRangeInputs').style.display='block'
        document.getElementById('pidInput').style.display='none'
        document.getElementById('selectBillType').style.display='block'
        document.getElementById('selectDoctor').style.display='block'
    } else if (value == 'byPatId') {
        document.getElementById('dateInput').style.display = 'none'
        document.getElementById('dateRangeInputs').style.display='block'
        document.getElementById('pidInput').style.display='block'
        document.getElementById('selectBillType').style.display='none'
        document.getElementById('selectDoctor').style.display='none'
    }
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
        url:'/sales/getHistoryByDate',
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
    let value = document.getElementById('filterType').value
    if(value == 'byDate'){
        getSalesHistoryDate()
    }else if (value == 'byDateRange'){
        getSalesHistoryRange()
    } else if (value == 'byPatId') {
        getSalesByPatId()
    }
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
    if( days > 365){
        new Noty({
            theme: 'relax',
            text: 'Max 1 year allowed',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    document.getElementById('loader').style.display='block'
    $.ajax({
        url:'/sales/getHistoryByRange',
        type:'Get',
        data:{
            startDate,
            endDate,
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

function showHistory(items){
    resetSelectionState()
    if(items.length < 1){
        document.getElementById("historyBody").innerHTML=
        `
        <tr>
            <td rowspan="3" colspan="12" style="text-align: center;">No Data found</td>
        </tr>
        `
        document.getElementById('tvalue').innerText='Total Amount : ₹ 0'
        document.getElementById('tvaluecash').innerText='Cash : ₹ 0'
        document.getElementById('tvalueonline').innerText='Online : ₹ 0'
        document.getElementById('tvalueindiqoo').innerText='Indiqoo : ₹ 0'
        //document.getElementById('pagination').innerHTML=``
        return
    }
    let total = 0
    let cashTotal = 0
    let onlineTotal = 0
    let indiqooTotal = 0
    let cashCounter = 0;
    let onlineCounter = 0
    let indiqooCounter = 0
    let container = document.getElementById('historyBody');
    
    container.innerHTML=``;
    let color = ''
    for(let i=0;i<items.length;i++){
        let Notes = "";
        if(items[i].type == 'Appointment'){
            color='#ffb0b0'
            Notes="OPD Charges"
        }else if(items[i].type == 'Pathology'){
            color='#f4c6fc'
        }else if(items[i].type == 'DischargeBill'){
            color='#f258d5b3'
        }else if(items[i].type == 'Ultrasound'){
            color='#55f2f4'
            Notes="USG charges"
        }else if(items[i].type == 'IPDAdvance'){
            color='#75f690'
            Notes="Advance Payment"
        }else if(items[i].type == 'Other'){
            color='#edf675' 
            Notes = items[i].Items[0].split('$')[3]
        }else{
            color='#d6d0d0'
        }
        
        let rowItem = document.createElement('tr');
        rowItem.id=items[i]._id+'row'
        rowItem.dataset.total = +(items[i].Total || 0)
        rowItem.dataset.cashPaid = +(items[i].CashPaid || 0)
        rowItem.dataset.onlinePaid = +(items[i].OnlinePaid || 0)
        rowItem.dataset.indiqooPaid = +(items[i].indiqooPaid || 0)
        rowItem.innerHTML=
        `
            <td class="toBeRemovedinPDF"><input type="checkbox" class="sale-select" value="${items[i]._id}" onchange="updateBulkCancelState()"></td>
            <td>${i+1}</td>
            <td>${items[i].PatiendID == null ? 'NA':items[i].PatiendID}</td>
            <td>${items[i].Name}</td>
            <td ondblclick="changePaymentMode('${items[i]._id}','${items[i].Total}')">₹ ${items[i].Total}</td>
            <td>${items[i].BillDate.split('-')[2]}-${items[i].BillDate.split('-')[1]}-${items[i].BillDate.split('-')[0]}</td>
            <td style = 'background-color:${color};font-weight:bold'><a target='_blank' href='/sales/bill/view/${items[i]._id}'>${items[i].ReportNo}</a></td>
            <td>${items[i].Doctor}</td>
            <td>${items[i].CashPaid}</td>
            <td>${items[i].OnlinePaid}</td>
            <td class="toBeRemovedinPDF">${Notes}</td>
            <td style='width:15%' class="toBeRemovedinPDF"><button onclick='cancelSale("${items[i]._id}")' class='btn btn-danger'><i style='display:block;' class="fa-regular fa-rectangle-xmark"></i>Cancel</button>
            </td>   
        `
        
        
        container.appendChild(rowItem);
        total = total  + +items[i].Total
        cashTotal = cashTotal + +items[i].CashPaid
        onlineTotal = onlineTotal + +items[i].OnlinePaid
        indiqooTotal = indiqooTotal + +(items[i].indiqooPaid || 0)
        if(items[i].CashPaid > 0) {
            cashCounter ++;
        }
        if(items[i].OnlinePaid > 0) {
            onlineCounter ++
        }
        if((items[i].indiqooPaid || 0) > 0) {
            indiqooCounter ++
        }
    }
    let printButton = document.getElementById('printSalesHistoryBtn');
    if(!printButton){
        printButton = document.createElement('button')
        printButton.id='printSalesHistoryBtn'
        printButton.innerText='Print'
        printButton.classList.add('btn')
        printButton.classList.add('btn-primary')
        printButton.addEventListener('click', printMe);
        document.getElementById('main-body').appendChild(printButton);
    }
    document.getElementById('tvalue').innerText='Total : ₹ '+total
    document.getElementById('tvaluecash').innerText='Cash ('+cashCounter + ') : ₹ '+cashTotal
    document.getElementById('tvalueonline').innerText='Online ('+onlineCounter + '): ₹ ' +onlineTotal
    document.getElementById('tvalueindiqoo').innerText='Indiqoo ('+indiqooCounter + '): ₹ ' +indiqooTotal
}

function resetSelectionState(){
    const selectAll = document.getElementById('selectAllSales');
    if(selectAll){
        selectAll.checked = false;
    }
    updateBulkCancelState();
}

function toggleSelectAll(source){
    let allCheckboxes = document.getElementsByClassName('sale-select');
    for(let i=0;i<allCheckboxes.length;i++){
        allCheckboxes[i].checked = source.checked;
    }
    updateBulkCancelState();
}

function updateBulkCancelState(){
    let selectedCount = getSelectedSaleIds().length;
    let bulkCancelBtn = document.getElementById('bulkCancelBtn');
    if(bulkCancelBtn){
        bulkCancelBtn.disabled = selectedCount < 1;
    }
    let selectAll = document.getElementById('selectAllSales');
    let allCheckboxes = document.getElementsByClassName('sale-select');
    if(selectAll){
        if(allCheckboxes.length < 1){
            selectAll.checked = false;
            selectAll.indeterminate = false;
            return;
        }
        selectAll.checked = selectedCount == allCheckboxes.length;
        selectAll.indeterminate = selectedCount > 0 && selectedCount < allCheckboxes.length;
    }
}

function getSelectedSaleIds(){
    let selectedIds = [];
    let allCheckboxes = document.getElementsByClassName('sale-select');
    for(let i=0;i<allCheckboxes.length;i++){
        if(allCheckboxes[i].checked){
            selectedIds.push(allCheckboxes[i].value);
        }
    }
    return selectedIds;
}


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
                removeSalesRows([id])
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

function bulkCancelSales(){
    let selectedSaleIds = getSelectedSaleIds();
    if(selectedSaleIds.length < 1){
        new Noty({
            theme: 'relax',
            text: 'Please select sales to cancel',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    let confirmation = window.confirm(selectedSaleIds.length + ' sales will be cancelled permantly');
    if(confirmation){
        $.ajax({
            url:'/sales/bulkCancel',
            type:'POST',
            traditional:true,
            data:{
                saleIds:selectedSaleIds
            },
            success:function(data){
                removeSalesRows(data.cancelledSaleIds || [])
                if(data.failedSales && data.failedSales.length > 0){
                    new Noty({
                        theme: 'relax',
                        text: data.failedSales.length + ' sale(s) could not be cancelled',
                        type: 'warning',
                        layout: 'topRight',
                        timeout: 2000
                    }).show();
                }
            },
            error:function(err){
                new Noty({
                    theme: 'relax',
                    text: 'Unable to bulk cancel sales',
                    type: 'error',
                    layout: 'topRight',
                    timeout: 1500
                }).show();
                return
            }
    
        })
    }
}

function removeSalesRows(ids){
    for(let i=0;i<ids.length;i++){
        let row = document.getElementById(ids[i]+'row');
        if(row){
            row.remove()
        }
    }
    resetSelectionState();
    if(document.getElementById('historyBody').children.length < 1){
        showHistory([])
    }else{
        updateVisibleTotals()
    }
}

function updateVisibleTotals(){
    let rows = document.getElementById('historyBody').children;
    let total = 0;
    let cashTotal = 0;
    let onlineTotal = 0;
    let indiqooTotal = 0;
    let cashCounter = 0;
    let onlineCounter = 0;
    let indiqooCounter = 0;
    for(let i=0;i<rows.length;i++){
        let amount = +(rows[i].dataset.total || 0);
        let cash = +(rows[i].dataset.cashPaid || 0);
        let online = +(rows[i].dataset.onlinePaid || 0);
        let indiqoo = +(rows[i].dataset.indiqooPaid || 0);
        total = total + amount;
        cashTotal = cashTotal + cash;
        onlineTotal = onlineTotal + online;
        indiqooTotal = indiqooTotal + indiqoo;
        if(cash > 0){
            cashCounter++;
        }
        if(online > 0){
            onlineCounter++;
        }
        if(indiqoo > 0){
            indiqooCounter++;
        }
    }
    document.getElementById('tvalue').innerText='Total : ₹ '+total
    document.getElementById('tvaluecash').innerText='Cash ('+cashCounter + ') : ₹ '+cashTotal
    document.getElementById('tvalueonline').innerText='Online ('+onlineCounter + '): ₹ ' +onlineTotal
    document.getElementById('tvalueindiqoo').innerText='Indiqoo ('+indiqooCounter + '): ₹ ' +indiqooTotal
}
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
        selects[i].style.display='none'
    }
    let otherItems = document.getElementsByClassName('toBeRemovedinPDF');
    for(let i=0;i<otherItems.length;i++){
        otherItems[i].style.display='none'
    }
    window.print()
}

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


function getSalesByPatId(){
    let startDate = document.getElementById('startDate').value
    let endDate = document.getElementById('endDate').value
    let patId = document.getElementById('patId').value
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
    if(patId == undefined || patId.length == 0 || patId == null) {
        new Noty({
            theme: 'relax',
            text: 'Patient id is empty',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    let days = (new Date(endDate).getTime() - new Date(startDate).getTime())/(60*24*60*1000)
    if( days > 365){
        new Noty({
            theme: 'relax',
            text: 'Max 1 year allowed',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    document.getElementById('loader').style.display='block'
    $.ajax({
        url:'/sales/getHistoryByPatId',
        type:'Get',
        data:{
            startDate,
            endDate,
            patId
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
