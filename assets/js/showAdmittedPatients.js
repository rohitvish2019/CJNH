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
            console.log("Room type is "+document.getElementById('RoomType_'+visitId).value)
            if(document.getElementById('RoomType_'+visitId).value != 'none'){
                document.getElementById(visitId+'_anchor').style.pointerEvents=''
            }
            
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
}


function getAdmitted(){
    let selectedOption = document.getElementById('')
}