function getAppointments(){
    document.getElementById('loader').style.display='block'
    let status = document.getElementById('ShowHideDisabled').checked;
    $.ajax({
        url:'/patients/getAppointmentsByDate',
        type:'Get',
        data:{
            date:document.getElementById('selectedDate').value,
            status
        },
        success:function(data){console.log(data.appointments)
            document.getElementById('loader').style.display='none'
            setAppointmentsOnUi(data.visits)
            
        },
        error:function(data){console.log
            document.getElementById('loader').style.display='none'
        }
    })
    
}

function setAppointmentsOnUi(appointments){
    let date = document.getElementById('selectedDate').value
    let parent = document.getElementById('table-body');
    parent.innerHTML=``;
    for(let i=0;i<appointments.length;i++){
        let child = document.createElement('tr');
        let checkStatus = appointments[i].isValid == true?'checked':null;
        child.innerHTML=
        `
            <th scope="row">${i+1}</th>
            <td>${appointments[i].Patient.Name}</td>
            <td>${appointments[i].Patient.Age}</td>
            <td>${appointments[i].Patient.Gender}</td>
            <td>${appointments[i].Patient.Address}</td>
            <td>${appointments[i].Fees}</td>
            <td>
                <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" onchange="enableDisableAppointMent('${appointments[i]._id}')" role="switch" id="checkbox_${appointments[i]._id}" ${checkStatus}>
                </div>
            </td>
            <td><a target="_blank" href="/patients/getOldPrescription/${appointments[i].Patient._id}?date=${date}">Prescription</a></td>
            <td><a target="_blank" href="/visits/oldMedBill/${appointments[i].Patient._id}?date=${date}">Medical Bill</a></td>
        `
        parent.appendChild(child);
    }
}

function enableDisableAppointMent(id){
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
            document.getElementById('loader').style.display='none'
        }
    })
  }

  