document.getElementById('loader').style.display='none'
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
    document.getElementById('addPayment').setAttribute('disabled', 'true')
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
                document.getElementById(id+'tr').style.display='none'
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
    document.getElementById('loader').style.display='block'
    $.ajax({
        url:'/patients/getIPDData/Range',
        data:{
            startDate,
            endDate
        },
        success:function(data){
            if(data.IPDs.length < 1){
                document.getElementById('table-content').innerHTML=
                `
                <tr>
                    <td colspan='13'>No Data Found</td>
                </tr>
                `
                document.getElementById('loader').style.display='none'
            }else{
                setIPDData(data.IPDs, data.rooms)
            }
            
        },
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
        let dateOptions = { hour: '2-digit', minute: '2-digit', hour12: true,year: 'numeric', month: '2-digit', day: '2-digit' };
        rowItem.innerHTML=
        `
        <th style='font-size:smaller'>${i+1}</th>
        <td style='font-size:smaller'>${visits[i].Patient.Id}</td>
        <td style='font-size:smaller'>${visits[i].Patient.Name}</td>
        <td style='font-size:smaller'>${visits[i].Patient.Age}</td>
        <td style='font-size:smaller'>${visits[i].Patient.Address}</td>
        <td style='font-size:smaller'>${visits[i].Patient.Mobile}</td>
        <td style='width:8%;font-size:smaller;'>${new Date(visits[i].AdmissionDate + ' ' +visits[i].AdmissionTime).toLocaleDateString('en-IN',dateOptions)}</td>
        <td><input style='font-size:smaller' id="dischargeDate_${visits[i]._id}" onchange="changeDischargeDate('${visits[i]._id}')" type='datetime-local' value='${visits[i].DischargeDate +' '+ visits[i].DischargeTime}'></td>
        <td>
            <select style='font-size:smaller' id="RoomType_${visits[i]._id}" value="${visits[i].RoomType}" onchange="changeRoom('${visits[i]._id}')"></select>
        </td>
        <td>
            <select style='font-size:smaller' id="DeliveryType_${visits[i]._id}" value="${visits[i].DeliveryType}" onchange="changeDeliveryType('${visits[i]._id}')">
                <option value=''>--Select--</option>
                <option value="VAGINAL DELIVERY(Day)">VAGINAL DELIVERY(Day)</option>
                <option value="VAGINAL INSTRUMENTAL DELIVERY(Day)">VAGINAL INSTRUMENTAL DELIVERY(Day)</option>
                <option value="HYSTERECTOMY(Day)">HYSTERECTOMY(Day)</option>
                <option value="LSCS(Day)">LSCS(Day)</option>
                <option value="LSCS WITH T/L(Day)">LSCS WITH T/L(Day)</option>
                <option value="LAPROSCOPY OP(Day)">LAPROSCOPY OP(Day)</option>
                <option value="LAPROTOMY(Day)">LAPROTOMY(Day)</option>
                <option value="VAGINAL DELIVERY(Night)">VAGINAL DELIVERY(Night)</option>
                <option value="VAGINAL INSTRUMENTAL DELIVERY(Night)">VAGINAL INSTRUMENTAL DELIVERY(Night)</option>
                <option value="HYSTERECTOMY(Night)">HYSTERECTOMY(Night)</option>
                <option value="LSCS(Night)">LSCS(Night)</option>
                <option value="LSCS WITH T/L(Night)">LSCS WITH T/L(Night)</option>
                <option value="LAPROSCOPY OP(Night)">LAPROSCOPY OP(Night)</option>
                <option value="LAPROTOMY(Night)">LAPROTOMY(Night)</option>
            </select>
        </td>
        <td>
            <div class=" dropdown">
                <button style="color: white;font-size:smaller !important;" class="btn btn-info dropdown-toggle" type="button" id="actions" data-bs-toggle="dropdown" aria-expanded="false">Generate</button>
                <ul class="dropdown-menu">
                <li><a target='_blank' class="dropdown-item" href="/patients/birthCertificate/${visits[i].Patient._id}">Birth Certificate</a></li>
                <li><a target='_blank' class="dropdown-item" href="/patients/dischargeSheet/${visits[i]._id}">Discharge Sheet</a></li>
                <li><a target='_blank' class="dropdown-item" href="/patients/AdmissionBill/${visits[i]._id}">Discharge Bill</a></li>
                <li><a target='_blank' class="dropdown-item" href="/patients/DischargeReceipt/${visits[i]._id}">Final Receipt</a></li>
                </ul>
            </div>
        </td>
        <td style="text-align: center !important;font-size:smaller">
            <button style='font-size:smaller' class="btn btn-info" onclick="openAdvancePayment('${visits[i].Patient.Id}','${visits[i].Patient.Name}','${visits[i]._id}')">Payment</button>
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
    document.getElementById('loader').style.display='none'
}

let startDate = document.getElementById('startdate').value
let endDate = document.getElementById('endDate').value
getIPDDataRange(startDate, endDate)