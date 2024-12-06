function changeDischargeDate(visitId){
    console.log(visitId);
    let dischargeDate = document.getElementById('dischargeDate_'+visitId).value;
    $.ajax({
        url:'/patients/saveDischargeDate',
        data:{
            dischargeDate,
            visitId
        },
        type:'Post',
        success:function(data){
        },
        error:function(err){}
    })
    console.log(dischargeDate)
}

function changeRoom(visitId){
    console.log(visitId);
    let RoomType = document.getElementById('RoomType_'+visitId).value;
    $.ajax({
        url:'/patients/saveRoomType',
        data:{
            RoomType,
            visitId
        },
        type:'Post',
        success:function(data){
            console.log("discharge date is "+document.getElementById('dischargeDate_'+visitId).value)
            if(document.getElementById('dischargeDate_'+visitId).value != ''){
                document.getElementById(visitId+'_anchor').style.pointerEvents=''
            }
        },
        error:function(err){}
    })
    console.log(dischargeDate)
}


function changeDeliveryType(visitId){
    console.log(visitId);
    let DeliveryType = document.getElementById('DeliveryType_'+visitId).value;
    $.ajax({
        url:'/patients/saveDeliveryType',
        data:{
            DeliveryType,
            visitId
        },
        type:'Post',
        success:function(data){
            //console.log("discharge date is "+document.getElementById('dischargeDate_'+visitId).value)
        },
        error:function(err){}
    })
}


function convertTo12HourFormat(time24) {
    // Split the input time into hours and minutes
    const [hours, minutes] = time24.split(":").map(Number);

    // Determine the period (AM/PM)
    const period = hours >= 12 ? "PM" : "AM";

    // Convert hours to 12-hour format
    const hours12 = hours % 12 || 12;

    // Return the formatted time
    return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
}


function addAdvancePayment(){
    $.ajax({
        url:'/patients/add/advancePayment',
        data:{
            visitId : document.getElementById('visitId').value,
            Amount : document.getElementById('amount').value,
            paymentType : document.getElementById('paymentType').value
        },
        type:'POST',
        success:function(data){
            new Noty({
                theme: 'relax',
                text: 'Advance payment saved',
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
            closePopup()
            return
        },
        error:function(err){}
    })
}

function openAdvancePayment(id,Name, visitId){
    document.getElementById('addPaymentPopup').style.display='block'
    document.getElementById('pid').value = id
    document.getElementById('Name').value = Name
    document.getElementById('visitId').value=visitId
}

function closePopup(){
    document.getElementById('addPaymentPopup').style.display='none'
    document.getElementById('deliveryDetails').style.display='none'
}


function getAdmitted(){
    let selectedOption = document.getElementById('')
}

function CancelIPD(id, pid){
    let confirmation = window.confirm("This IPD will be cancelled permanently !!!")
    if(confirmation){
        $.ajax({
            url:'/patients/cancel/IPD/'+id,
            type:'POST',
            success:function(data){
                document.getElementById(pid).style.display='none'
            },
            error:function(err){}
        })
    }
}

function getIPDDataRange(){
    let startDate = document.getElementById('startdate').value
    let endDate = document.getElementById('endDate').value

    if(startDate == '' || endDate == ''){
        return 0
    }
    $.ajax({
        url:'/patients/getIPDData/Range',
        data:{
            startDate,
            endDate
        },
        success:function(data){setIPDData(data.IPDs, data.rooms)},
        error:function(err){
            console.log(err)
        }
    })
}

function setIPDData(visits, rooms){
    
    let container = document.getElementById('table-content')
    container.innerHTML=``;
    for(let i=0;i<visits.length;i++){
        let rowItem = document.createElement('tr');
        if(visits[i].isDischarged == true){
            rowItem.style.backgroundColor='#bef5be'
        }
        rowItem.id=visits[i]._id+'tr'
        rowItem.innerHTML=
        `
        <th>${i+1}</th>
        <td>${visits[i].Patient.Id}</td>
        <td>${visits[i].Patient.Name}</td>
        <td>${visits[i].Patient.Age}</td>
        <td>${visits[i].Patient.Address}</td>
        <td>${visits[i].Patient.Mobile}</td>
        <td style='width:8%'>${(new Date(visits[i].AdmissionDate + ' ' +visits[i].AdmissionTime)).toLocaleString().split(',')}</td>
        <td><input id="dischargeDate_${visits[i]._id}" onchange="changeDischargeDate('${visits[i]._id}')" type='datetime-local' value='${visits[i].DischargeDate +' '+ visits[i].DischargeTime}'></td>
        <td>
            <select id="RoomType_${visits[i]._id}" value="${visits[i].RoomType}" onchange="changeRoom('${visits[i]._id}')"></select>
        </td>
        <td>
            <select id="DeliveryType_${visits[i]._id}" value="${visits[i].DeliveryType}" onchange="changeDeliveryType('${visits[i]._id}')">
                <option value=''>--Select--</option>
                <option value="Vaginal">Vaginal</option>
                <option value="Caesarean">Caesarean</option>
                <option value="Vaginal Instrumental">Vaginal Instrumental</option>
            </select>
        </td>
        <td>
            <div class=" dropdown">
                <button style="color: white;" class="btn btn-info dropdown-toggle" type="button" id="actions" data-bs-toggle="dropdown" aria-expanded="false"> Actions </button>
                <ul class="dropdown-menu">
                <li><a target='_blank' class="dropdown-item" href="/patients/AdmissionBill/${visits[i]._id}">Discharge Bill</a></li>
                <li><a target='_blank' class="dropdown-item" href="/patients/DischargeReceipt/${visits[i]._id}">Generate Receipt</a></li>
                <li><a target='_blank' class="dropdown-item" href="/patients/dischargeSheet/${visits[i]._id}">Discharge Sheet</a></li>
                <li><a target='_blank' class="dropdown-item" href="/patients/birthCertificate/${visits[i].Patient._id}">Generate Birth Certificate</a></li>
                </ul>
            </div>
        </td>
        <td style="text-align: center !important;">
            <button class="btn btn-info" onclick="openAdvancePayment('${visits[i].Patient.Id}','${visits[i].Patient.Name}','${visits[i]._id}')">Add Payment</button>
        </td>
        <td style="text-align: center !important;">
            <button class="btn-danger btn" onclick="CancelIPD('${visits[i]._id}','${visits[i].Patient._id}')"><i class="fa-solid fa-ban"></i></button>
        </td>
        `
        container.appendChild(rowItem)
        let selectContainer = document.getElementById('RoomType_'+visits[i]._id);
        selectContainer.innerHTML=`<option value='none'>--Select--</option>`
        for(let j=0;j<rooms.length;j++){
            let item = document.createElement('option');
            item.innerText = rooms[j].Name
            item.value = rooms[j].Name
            selectContainer.appendChild(item);
        }
        selectContainer.value=visits[i].RoomType == ''?'none':visits[i].RoomType
        document.getElementById('DeliveryType_'+visits[i]._id).value=visits[i].DeliveryType
    }
}