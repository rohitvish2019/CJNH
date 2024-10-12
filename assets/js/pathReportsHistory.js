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


function getSalesHistoryRange(){
    let startDate = document.getElementById('startDate').value
    let endDate = document.getElementById('endDate').value
    let status = document.getElementById('status').value
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
    if( days > 120){
        new Noty({
            theme: 'relax',
            text: 'Max 4 Months allowed',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    document.getElementById('loader').style.display='block'
    $.ajax({
        url:'/reports/getHistoryByRange',
        type:'Get',
        data:{
            startDate,
            endDate,
            status
        },
        success:function(data){
            document.getElementById('loader').style.display='none'
            if(status == 'pending'){
                showReportOnUIPending(data.reportsList)
            }else{
                showReportOnUI(data.reportsList) 
            }
        },
        error:function(err){
            document.getElementById('loader').style.display='none'
            console.log(err)
            document.getElementById("historyBody").innerHTML=
            `
            <tr>
                <td rowspan="3" colspan="9" style="text-align: center;">No Data found</td>
            </tr>
            `
            
            return
        }
    })
}
function getSalesHistoryDate(){
    let selectedDate = document.getElementById('selectedDate').value
    let status = document.getElementById('status').value
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
        url:'/reports/getHistoryByDate',
        type:'Get',
        data:{
            selectedDate,
            status
        },
        success:function(data){
            document.getElementById('loader').style.display='none'
            if(data.reportsList.length < 1){
                
            }
            if(status == 'pending'){
                showReportOnUIPending(data.reportsList)
            }else{
                showReportOnUI(data.reportsList) 
            }
              
             
        },
        error:function(err){
            console.log(err)
            document.getElementById('loader').style.display='none'
            document.getElementById("historyBody").innerHTML=
            `
            <tr>
                <td rowspan="3" colspan="9" style="text-align: center;">No Data found</td>
            </tr>
            `
            return
        }
    })
}


changeInputs()

function getReportsHistory(){
    let value = document.getElementById('filterType').value
    if(value == 'byDate'){
        getSalesHistoryDate()
    }else if (value == 'byDateRange'){
        getSalesHistoryRange()
    }
}

function showReportOnUI(reports){
    console.log(reports)
    let i = 0
    let container = document.getElementById('historyBody');
    container.innerHTML=``
    for(let i=0;i<reports.length;i++){
        let rowItem = document.createElement('tr');
        rowItem.innerHTML=
        `
            <td>${i+1}</td>
            <td>${reports[i].Name}</td>
            <td><a target='_blank' href='/reports/view/${reports[i]._id}'>${reports[i].ReportNo}</a></td>
            <td>${reports[i].Date}</td>
            `
        container.appendChild(rowItem)
    }
}

function showReportOnUIPending(reports){
    let i = 0
    let container = document.getElementById('historyBody');
    container.innerHTML=``
    for(let i=0;i<reports.length;i++){
        let rowItem = document.createElement('tr');
        rowItem.innerHTML=
        `
            <td>${i+1}</td>
            <td>${reports[i].Name}</td>
            <td><a target='_blank' href='/reports/home/${reports[i].Patient}/?bill=${reports[i]._id}'>${reports[i].ReportNo}</a></td>
            <td>${reports[i].Date}</td>
            `
        container.appendChild(rowItem)
    }
}