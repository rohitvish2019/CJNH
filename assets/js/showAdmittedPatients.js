function changeDischargeDate(visitId){
    console.log(visitId);
    let dischargeDate = document.getElementById('dischargeDate').value;
    $.ajax({
        url:'/patients/saveDischargeDate',
        data:{
            dischargeDate,
            visitId
        },
        type:'Post',
        success:function(data){},
        error:function(err){}
    })
    console.log(dischargeDate)
}

function changeRoom(visitId){
    console.log(visitId);
    let RoomType = document.getElementById('RoomType').value;
    $.ajax({
        url:'/patients/saveRoomType',
        data:{
            RoomType,
            visitId
        },
        type:'Post',
        success:function(data){},
        error:function(err){}
    })
    console.log(dischargeDate)
}