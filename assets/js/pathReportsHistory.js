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
        },
        success:function(data){
            document.getElementById('loader').style.display='none'
            if(data.sales.length < 1){
                document.getElementById("historyBody").innerHTML=
                `
                <tr>
                    <td rowspan="3" colspan="9" style="text-align: center;">No Data found</td>
                </tr>
                `
                document.getElementById('pagination').innerHTML=``
                return
            }
            if(BillType == 'Medical Bill Ext'){
                setHistoryOnUiExtMed(data.sales)
            }else if(BillType == 'Medical Bill'){
                setHistoryOnUiIntMed(data.sales,data.hostname, data.port, data.protocol)
            }
            else{
                setHistoryOnUi(data.sales,data.hostname, data.port, data.protocol)
            }
        },
        error:function(err){
            document.getElementById('loader').style.display='none'
            console.log(err)}
    })
}
function getSalesHistoryDate(){
    let selectedDate = document.getElementById('selectedDate').value
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
        },
        success:function(data){
            document.getElementById('loader').style.display='none'
            if(data.sales.length < 1){
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
            if(BillType == 'Medical Bill Ext'){
                setHistoryOnUiExtMed(data.sales)
            }else if(BillType == 'Medical Bill'){
                setHistoryOnUiIntMed(data.sales,data.hostname, data.port, data.protocol)
            }
            else{
                setHistoryOnUi(data.sales,data.hostname, data.port, data.protocol)
            }
            
        },
        error:function(err){
            document.getElementById('loader').style.display='none'
            console.log(err)}
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