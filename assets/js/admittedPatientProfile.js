function loadTests(){
    let reportNo = document.getElementById('reportNo').value;
    $.ajax({
        url:'/reports/getByReportNumber',
        data:{
            reportNo
        },
        type:'GET',
        success:function(data){
            console.log(data)
        },
        error:function(err){}
    })
}