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