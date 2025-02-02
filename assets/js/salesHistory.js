function changeInputs(){
    let value = document.getElementById('filterType').value
    if(value == 'byDate'){
        document.getElementById('dateRangeInputs').style.display='none'
        document.getElementById('dateInput').style.display='block'
    }else if (value == 'byDateRange'){
        document.getElementById('dateInput').style.display='none'
        document.getElementById('dateRangeInputs').style.display='block'
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
            if(data.billsList.length < 1){
                document.getElementById("historyBody").innerHTML=
                `
                <tr>
                    <td rowspan="3" colspan="9" style="text-align: center;">No Data found</td>
                </tr>
                `
                document.getElementById('tvalue').innerText='Total Amount : 0'
                document.getElementById('pagination').innerHTML=``
                return
            }
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
            if(data.billsList.length < 1){
                document.getElementById("historyBody").innerHTML=
                `
                <tr>
                    <td rowspan="3" colspan="9" style="text-align: center;">No Data found</td>
                </tr>
                `
                return
            }
            showHistory(data.billsList)
        },
        error:function(err){
            document.getElementById('loader').style.display='none'
            console.log(err)}
    })
}

function showHistory(items){
    let total = 0
    let cashTotal = 0
    let onlineTotal = 0
    let container = document.getElementById('historyBody');
    container.innerHTML=``;
    let color = ''
    for(let i=0;i<items.length;i++){
        if(items[i].type == 'Appointment'){
            color='#ffb0b0'
        }else if(items[i].type == 'Pathology'){
            color='#f4c6fc'
        }else if(items[i].type == 'DischargeBill'){
            color='#f258d5b3'
        }else if(items[i].type == 'Ultrasound'){
            color='#55f2f4'
        }else if(items[i].type == 'IPDAdvance'){
            color='#75f690'
        }else if(items[i].type == 'Other'){
            color='#edf675' 
        }else{
            color='#d6d0d0'
        }
        
        let rowItem = document.createElement('tr');
        rowItem.id=items[i]._id+'row'
        if(items[i].type == 'IPDAdvance'){
            
            rowItem.innerHTML=
        `
            <td>${i+1}</td>
            <td>${items[i].PatiendID == null ? 'NA':items[i].PatiendID}</td>
            <td>${items[i].Name}</td>
            <td>₹ ${items[i].Total}</td>
            <td>${items[i].BillDate.split('-')[2]}-${items[i].BillDate.split('-')[1]}-${items[i].BillDate.split('-')[0]}</td>
            <td style = 'background-color:${color};font-weight:bold'><a target='_blank' href='/sales/bill/view/${items[i]._id}'>${items[i].ReportNo}</a></td>
            <td>${items[i].Doctor}</td>
            <td>${items[i].CashPaid}</td>
            <td>${items[i].OnlinePaid}</td>
            <td style='width:15%'><button onclick='cancelSale("${items[i]._id}")' class='btn btn-danger'><i style='display:block;' class="fa-regular fa-rectangle-xmark"></i>Cancel</button>
            </td>   
        `
        }else{
            rowItem.innerHTML=
        `
            <td>${i+1}</td>
            <td>${items[i].PatiendID == null ? 'NA':items[i].PatiendID}</td>
            <td>${items[i].Name}</td>
            <td>₹ ${items[i].Total}</td>
            <td>${items[i].BillDate.split('-')[2]}-${items[i].BillDate.split('-')[1]}-${items[i].BillDate.split('-')[0]}</td>
            <td style = 'background-color:${color};font-weight:bold'><a target='_blank' href='/sales/bill/view/${items[i]._id}'>${items[i].ReportNo}</a></td>
            <td>${items[i].Doctor}</td>
            <td>${items[i].CashPaid}</td>
            <td>${items[i].OnlinePaid}</td>
            <td style='width:15%'><button onclick='cancelSale("${items[i]._id}")' class='btn btn-danger'><i style='display:block;' class="fa-regular fa-rectangle-xmark"></i>Cancel</button>
            </td>   
        `
        }
        
        container.appendChild(rowItem);
        total = total  + +items[i].Total
        cashTotal = cashTotal + +items[i].CashPaid
        onlineTotal = onlineTotal + +items[i].OnlinePaid
    }
    let printButton = document.createElement('button')
    printButton.innerText='Print'
    printButton.classList.add('btn')
    printButton.classList.add('btn-primary')
    printButton.addEventListener('click', printMe);
    document.getElementById('main-body').appendChild(printButton);
    document.getElementById('tvalue').innerText='Total : ₹ '+total
    document.getElementById('tvaluecash').innerText='Cash : ₹ '+cashTotal
    document.getElementById('tvalueonline').innerText='Online : ₹ '+onlineTotal
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
    window.print()
}