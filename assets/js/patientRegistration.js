let inputData = ['Name','Gender','Age','Address','Mobile','Fees'];
function registerPatient(){
    console.log("Registering patient");
    let data = {}
    data['bookAppointment'] = document.getElementById('flexCheckChecked').checked; 
    for(let i=0;i<inputData.length;i++){
        data[inputData[i]] = document.getElementById(inputData[i]).value;
        if(i != 4 && (document.getElementById(inputData[i]).value == null || document.getElementById(inputData[i]).value == '' )){
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
        url:'/patients/register',
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
            window.location.href='/patients/new'
        },
        error:function(err){console.log(err.responseText)}
    });
}


function searchById(){
    let id = document.getElementById('patientID').value;
    
    $.ajax({
        url:'/patients/get/'+id,
        type:'Get',
        success:function(data){
            new Noty({
                theme: 'relax',
                text: 'Patient data setup done',
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
            for(let i=0;i<inputData.length;i++){
                if(document.getElementById(inputData[i])){
                    document.getElementById(inputData[i]).value = data.patient[0].PatientId[inputData[i]];
                }
            }
            let visitDate = data.patient[0].createdAt.toString().split('T')[0].split('-');
            
            document.getElementById('lastFeesPaid').innerText=data.patient[0].Fees
            document.getElementById('lastVisitDate').innerText=visitDate[2]+'-'+visitDate[1]+'-'+visitDate[0]
            document.getElementById('register').setAttribute('disabled','true');
            document.getElementById('bookAppointment').removeAttribute('disabled')
        },
        error:function(err){
            new Noty({
                theme: 'relax',
                text: 'No pateint found, Please check again or register new',
                type: 'warning',
                layout: 'topRight',
                timeout: 1500
            }).show();
            for(let i=0;i<inputData.length;i++){
                if(document.getElementById(inputData[i])){
                    document.getElementById(inputData[i]).value = '';
                }
            }
            document.getElementById('lastFeesPaid').innerText='NA'
            document.getElementById('lastVisitDate').innerText='NA'
            
            document.getElementById('bookAppointment').setAttribute('disabled','true');
            document.getElementById('register').removeAttribute('disabled');
        }
    })
}


function bookAppointmentWithId(){
    let fees = document.getElementById('Fees').value;
    if(!fees || fees == ''){
        new Noty({
            theme: 'relax',
            text: 'Fees is mandatory',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    $.ajax({
        url:'/appointments/bookToday',
        type:'Post',
        data:{
            PatientId:document.getElementById('patientID').value,
            date:null,
            Fees: document.getElementById('Fees').value
        },
        success:function(data){
            new Noty({
                theme: 'relax',
                text: data.message,
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
            window.open('/appointments/receipt/'+data.appointment._id)
            window.location.href='/patients/new'
        },
        error: function(err){
            new Noty({
                theme: 'relax',
                text: JSON.parse(err.responseText).message,
                type: 'error',
                layout: 'topRight',
                timeout: 1500
            }).show();
        }
    })
}