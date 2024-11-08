

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
            
            for(let i=0;i<data.visits.length;i++){
                let rowItem = document.createElement('tr');
                let checkStatus = data.visits[i].isValid == true?'checked':null;
                rowItem.innerHTML=
                `
                    <tr id="${data.visits[i]._id}">
                        <th scope="row">${i+1}</th>
                        <td>${data.visits[i].Patient.Id}</td>
                        <td>${data.visits[i].Patient.Doctor}</td>
                        <td>${data.visits[i].Patient.Name}</td>
                        <td>${data.visits[i].Patient.Age}</td>
                        <td>${data.visits[i].Patient.Gender}</td>
                        <td>${data.visits[i].Patient.Address}</td>
                        <td>${data.visits[i].Fees}</td>
                        <td><a target='_blank' href="/patients/getHistory/${data.visits[i].Patient._id}">Patient History</a></td>
                        <td><a href="/patients/getPrescription/${data.visits[i]._id}">Prescription</a></td>
                        <td>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" onchange="enableDisableAppointMent('${data.visits[i]._id}')" role="switch" id="checkbox_${data.visits[i]._id}" ${checkStatus}>
                        </div>
                        </td>
                        
                    </tr>
                `
                container.appendChild(rowItem)
            }
            document.getElementById('loader').style.display='none'
        },
        error:function(err){console.log(err)}
    })
}
  