let inputData = ['Name','Gender','Age','Address','AdmissionDate','Doctor','Husband','Mobile','Reason','AdmissionTime'];
function admitPatient(){
    let data = {}
    for(let i=0;i<inputData.length;i++){
        data[inputData[i]] = document.getElementById(inputData[i]).value;
        if((document.getElementById(inputData[i]).value == null || document.getElementById(inputData[i]).value == '' )){
            new Noty({
                theme: 'relax',
                text: inputData[i] + ' is mandatory',
                type: 'error',
                layout: 'topRight',
                timeout: 1500
            }).show();
            return;
        }
    }
    $.ajax({
        url:'/patients/admit',
        type:'POST',
        data:data,
        success:function(data){
            new Noty({
                theme: 'relax',
                text: data.message,
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
            for(let i=0;i<inputData.length;i++){
                document.getElementById(inputData[i]).value=''
            }
            window.open('/appointments/receipt/'+data.appointment._id)
        },
        error:function(err){console.log(err.responseText)}
    });
}
