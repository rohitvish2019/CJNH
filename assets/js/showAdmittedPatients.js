function changeDischargeDate(visitId){
    console.log(visitId);
    let dischargeDate = document.getElementById('dischargeDate').value;
    $.ajax({
        url:'/patients/saveDischargeDate',
        data:dischargeDate,
        type:'Post',
        success:function(data){},
        error:function(err){}
    })
    console.log(dischargeDate)
}