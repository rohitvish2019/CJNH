function changeInputs(){
    let value = document.getElementById('filterType').value
    if(value == 'byDate'){
        document.getElementById('idInput').style.display='none'
        document.getElementById('dateRangeInputs').style.display='none'
        document.getElementById('dateInput').style.display='block'
    }else if (value == 'byDateRange'){
        document.getElementById('idInput').style.display='none'
        document.getElementById('dateInput').style.display='none'
        document.getElementById('dateRangeInputs').style.display='block'
    }else if(value == 'byId'){
        document.getElementById('dateRangeInputs').style.display='none'
        document.getElementById('dateInput').style.display='none'
        document.getElementById('idInput').style.display='block'
    }
}


function getBirthHistoryRange(){
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
        url:'/reports/getBirthHistoryByRange',
        type:'Get',
        data:{
            startDate,
            endDate,
        },
        success:function(data){
            document.getElementById('loader').style.display='none'
            if(!data.reportsList || data.reportsList.length < 1){
                document.getElementById("historyBody").innerHTML=
                `
                    <tr>
                        <td rowspan="3" colspan="9" style="text-align: center;">No Data found</td>
                    </tr>
                `
                return
            }
            if(status == 'pending'){
                showReportOnUICancelled(data.reportsList)
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
function getBirthHistoryDate(){
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
        url:'/reports/getBirthHistoryByDate',
        type:'Get',
        data:{
            selectedDate,
        },
        success:function(data){
            document.getElementById('loader').style.display='none'
            if(!data.reportsList || data.reportsList.length < 1){
                document.getElementById("historyBody").innerHTML=
                `
                    <tr>
                        <td rowspan="3" colspan="9" style="text-align: center;">No Data found</td>
                    </tr>
                `
                return
            }
            
            showReportOnUI(data.reportsList) 
            
              
             
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

function getBirthHistory(){
    let value = document.getElementById('filterType').value
    if(value == 'byDate'){
        getBirthHistoryDate()
    }else if (value == 'byDateRange'){
        getBirthHistoryRange()
    }
    else if(value == 'byId'){
        getBirthHistoryById();
    }
}
function getBirthHistoryById(){

    let id = document.getElementById('idToSearch').value
    if(!id || id == null || id == ''){
        new Noty({
            theme: 'relax',
            text: 'ID is mandatory',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    document.getElementById('loader').style.display='block'
    $.ajax({
        url:'/reports/getBirthHistoryById',
        type:'Get',
        data:{
            id,
            status
        },
        success:function(data){
            document.getElementById('loader').style.display='none'
            if(!data.reportsList || data.reportsList.length < 1){
                document.getElementById("historyBody").innerHTML=
                `
                    <tr>
                        <td rowspan="3" colspan="9" style="text-align: center;">No Data found</td>
                    </tr>
                `
                return
            }
            showReportOnUI(data.reportsList) 
            
              
             
        },
        error:function(err){
            console.log(err)
            document.getElementById('loader').style.display='none'
            document.getElementById("historyBody").innerHTML=
            `
            <tr>
                <td rowspan="3" colspan="9" style="text-align: center;">Unable to fetch inofrmation</td>
            </tr>
            `
            return
        }
    })
}
function showReportOnUI(reports){
    console.log(reports)
    let i = 0
    let container = document.getElementById('historyBody');
    container.innerHTML=``
    for(let i=0;i<reports.length;i++){
        let rowItem = document.createElement('tr');
        rowItem.id=reports[i]._id
        rowItem.innerHTML=
        `
            <td>${i+1}</td>
            <td>${reports[i].Name}</td>
            <td>${reports[i].OPDId}</td>
            <td>${reports[i].Age}</td>
            <td><a target='_blank' href='/patients/birthCertificate/view/${reports[i]._id}'>${reports[i].CertificateNumber}</a></td>
            <td>${reports[i].BirthDate.split('-')[2]}-${reports[i].BirthDate.split('-')[1]}-${reports[i].BirthDate.split('-')[0]}</td>
            <td><button class='btn btn-danger' onclick='cancelBirthReport("${reports[i]._id}")'><i
              class="fa-solid fa-ban"></i> Cancel</button></td>
            
        `
        container.appendChild(rowItem)
    }
}


function cancelBirthReport(id){
    let confirmation = window.confirm("Certificate will be cancelled permanently.");
    if(confirmation){
        $.ajax({
            url:'/reports/birthCertificate/cancel/',
            type:'post',
            data:{
                id
            },
            success:function(data){
                new Noty({
                    theme: 'relax',
                    text: 'Report cancelled',
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1500
                }).show();
                document.getElementById(id).remove();
                return
            },
            error: function(err){
                new Noty({
                    theme: 'relax',
                    text: 'Unable to cancel report',
                    type: 'error',
                    layout: 'topRight',
                    timeout: 1500
                }).show();
                return
            }
        })
    }
    
}
function showReportOnUICancelled(reports){
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