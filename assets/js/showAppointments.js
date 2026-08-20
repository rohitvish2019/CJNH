
getAppointmentsToday()
function keepOnHold(id){
    document.getElementById(id +'_rea').style.display='block'
    document.getElementById(id+'_koh').style.display='none'
  }
  
  function reActivate(id){
    console.log("Activating "+ id)
    document.getElementById(id+'_rea').style.display='none'
    document.getElementById(id +'_koh').style.display='block'
  }
  function enableDisableAppointMent(id){
    document.getElementById('ShowHideDisabled').setAttribute('checked', 'true')
    let status = document.getElementById('checkbox_'+id).checked;
    document.getElementById('loader').style.display='block'
    $.ajax({
        url:'/patients/visits/changeStatus',
        data:{
            id,
            status
        },
        type:'Post',
        success:function(data){
            document.getElementById('loader').style.display='none'
        },
        error:function(err){
            document.getElementById('checkbox_'+id).checked = !status
            document.getElementById('loader').style.display='none'
        }
    })
  }
function getAppointmentsToday(){
    let status = document.getElementById('ShowHideDisabled').checked
    document.getElementById('loader').style.display='block'
    let container = document.getElementById('tableBody');
    container.innerHTML=``;
    $.ajax({
        url:'/patients/getAppointments/today',
        type:'Get',
        data:{
            status
        },
        success:function(data){
            let color=''
            let completedCount = 0;
            let pendingCount = 0;
            for(let i=0;i<data.visits.length;i++){
                if(data.visits[i].Fees == 500){
                    color = '#75f690'
                }else if(data.visits[i].Fees == 300){
                    color = '#edf675'
                }else{
                    color='#ffb0b0'
                }
                let rowItem = document.createElement('tr');
                let checkStatus = data.visits[i].isValid == true?'checked':null;
                let bgcolor = 'yellow'
                let fontColor = '#10132e'
                let visitStatus = 'In Queue'
                if(data.visits[i].VisitData && data.visits[i].VisitData.complaint){
                    bgcolor = 'green'
                    fontColor = 'white'
                    visitStatus='Completed'
                    completedCount++;
                } else {
                    pendingCount++;
                }
                
                rowItem.innerHTML=
                `
                    <tr id="${data.visits[i]._id}">
                        <th scope="row">${i+1}</th>
                        <td>${data.visits[i].Patient.Id}</td>
                        <td>${data.visits[i].Doctor}</td>
                        <td>${data.visits[i].Patient.Name}</td>
                        <td>${data.visits[i].Patient.Age}</td>
                        <td>${data.visits[i].Patient.Husband}</td>
                        <td>${data.visits[i].Patient.Address}</td>
                        <td style='background-color:${color};font-weight:bold;color:black'>
                            ${data.visits[i].Fees} (${data.visits[i].SaleId.PaymentType})
                            <div><small id="createdAt_${data.visits[i]._id}" style="font-size:10px;color:#222;display:block;margin-top:4px"></small></div>
                        </td>
                        <td><a target='_blank' href="/patients/getHistory/${data.visits[i].Patient._id}">Patient History</a></td>
                        <td><a target='_blank' href="/patients/getPrescription/${data.visits[i]._id}">Prescription</a></td>
                        <td>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" onchange="enableDisableAppointMent('${data.visits[i]._id}')" role="switch" id="checkbox_${data.visits[i]._id}" ${checkStatus}>
                        </div>
                        </td>
                        <td style="color: ${fontColor};background-color: ${bgcolor};font-weight: bold;">
                            <span >${visitStatus}</span>
                        </td>
                    </tr>
                `
                container.appendChild(rowItem)
                // populate createdAt converted to IST (use provided convertUTCtoIST if available)
                try{
                    const caElem = document.getElementById('createdAt_'+data.visits[i]._id);
                    if(caElem){
                        if(typeof convertUTCToIST === 'function'){
                            caElem.innerText = convertUTCToIST(data.visits[i].createdAt);
                        } else if (typeof utcToIST === 'function'){
                            caElem.innerText = utcToIST(data.visits[i].createdAt);
                        } else {
                            // fallback: convert using JS Intl in Asia/Kolkata
                            const d = new Date(data.visits[i].createdAt);
                            caElem.innerText = d.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });
                        }
                    }
                }catch(err){console.warn('createdAt populate error',err)}
            }
            document.getElementById('loader').style.display='none'
            document.getElementById('completedCount').innerText = "Completed : "+completedCount;
            document.getElementById('pendingCount').innerText = "Pending : "+pendingCount;
        },
        error:function(err){console.log(err)}
    })
}
  function uploadReport(){
    var formData = new FormData();
    let file = document.getElementById('file').files[0];
    formData.append('file',file)
    console.log(file);
    /*
    $.ajax({
        url:'/uploads/report',
        type:'Post',
        data:formData,
        success:function(data){console.log(data)},
        error:function(err){console.log(err)}
    })
*/
    var formData = new FormData();
    formData.append('file', document.getElementById('file').files[0]);
    $.ajax({
        url : '/uploads/report',
        type : 'POST',
        data : formData,
        processData: false,   // tell jQuery not to process the data            
        contentType: false,  // tell jQuery not to set contentType            
        success : function(data) {                
            console.log(data);                
            alert(data);
        }
    });
        
  }

  function utcToIST(utcTime) {
    if (!utcTime || typeof utcTime !== 'string') {
        return null;
    }

    const date = new Date(utcTime);

    // Invalid date
    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    })
        .format(date)
        .replace(',', ' at');
}