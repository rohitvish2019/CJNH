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
            BillType
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
    if( days > 31){
        new Noty({
            theme: 'relax',
            text: 'Max 1 Month allowed',
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
            BillType
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
    let container = document.getElementById('historyBody');
    container.innerHTML=``;
    for(let i=0;i<items.length;i++){
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
            <td><a target='_blank' href='/sales/bill/view/${items[i]._id}'>${items[i].ReportNo}</a></td>
            <td>${items[i].Doctor}</td>
            <td>${items[i].PaymentType}</td>
            <td style='width:15%'><button disabled onclick='cancelSale("${items[i]._id}")' class='btn btn-danger'><i style='display:block;' class="fa-regular fa-rectangle-xmark"></i>Cancel</button>
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
            <td><a target='_blank' href='/sales/bill/view/${items[i]._id}'>${items[i].ReportNo}</a></td>
            <td>${items[i].Doctor}</td>
            <td>${items[i].PaymentType}</td>
            <td style='width:15%'><button onclick='cancelSale("${items[i]._id}")' class='btn btn-danger'><i style='display:block;' class="fa-regular fa-rectangle-xmark"></i>Cancel</button>
            </td>   
        `
        }
        
        container.appendChild(rowItem);
        total = total  + +items[i].Total
    }

    document.getElementById('tvalue').innerText='Total : ₹ '+total
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