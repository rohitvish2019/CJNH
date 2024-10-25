function SaveDischargeBill(){
    $.ajax({
        url:'/patients/saveDischargeBill',
        data:{
            visitId : document.getElementById('visitId').value
        },
        type:'Post',
        success:function(data){
            console.log(data)
            window.location.href='/sales/bill/view/'+data.sale._id
        }
    })
}

