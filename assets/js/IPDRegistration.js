let inputData = ['Name','Gender','Age','Address','AdmissionDate','Doctor','Husband','Mobile','Reason','AdmissionTime', 'IdProof'];
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
    let id = document.getElementById('patientID').value;
    $.ajax({
        url:'/patients/admit',
        type:'POST',
        data:{data, id},
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
            window.location.href='/patients/IPD/new'
            window.open('/appointments/receipt/'+data.appointment._id)
        },
        error:function(err){console.log(err.responseText)}
    });
}


function searchById() {
    let id = document.getElementById('patientID').value;
    $.ajax({
        url: '/patients/get/' + id,
        type: 'Get',
        success: function (data) {
            new Noty({
                theme: 'relax',
                text: 'Patient data setup done',
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
            for (let i = 0; i < inputData.length; i++) {
                if (document.getElementById(inputData[i]) && data.patient[inputData[i]]) {
                    document.getElementById(inputData[i]).value = data.patient[inputData[i]] == undefined ? '' : data.patient[inputData[i]];
                }
            }

        },
        error: function (err) {
            new Noty({
                theme: 'relax',
                text: 'No pateint found, Please check again or register new',
                type: 'warning',
                layout: 'topRight',
                timeout: 1500
            }).show();
            for (let i = 0; i < inputData.length; i++) {
                if (document.getElementById(inputData[i])) {
                    document.getElementById(inputData[i]).value = '';
                }
            }
            
            document.getElementById('patientID').value ='';
        }
    })
}
