
function saveBirthDetails(){
    let OPDId = document.getElementById('patientId').value
    let Name = document.getElementById('Name').value
    let Husband = document.getElementById('Husband').value
    let Age = document.getElementById('Age').value
    let Village = document.getElementById('Village').value
    let Tahsil = document.getElementById('Tahsil').value
    let District = document.getElementById('District').value
    let State = document.getElementById('State').value
    let DeliveryType = document.getElementById('DeliveryType').value
    let Gender = document.getElementById('Gender').value
    let BirthTime = document.getElementById('BirthTime').value
    let BirthDate = document.getElementById('BirthDate').value
    let ChildWeight = document.getElementById('ChildWeight').value
    let validateData = ['Name','Husband','Age','Village','Tahsil','District','State','DeliveryType','Gender','BirthTime','BirthDate','ChildWeight']
    for(let i=0;i<validateData.length;i++){
        let item = document.getElementById(validateData[i]).value
        if(!item  || item == null || item == ''){
            new Noty({
                theme: 'relax',
                text: 'Please fill valid '+validateData[i],
                type: 'warning',
                layout: 'topRight',
                timeout: 1500
            }).show();
            return
        }
    }
    $.ajax({
        url:'/patients/birthCertificate/save',
        type:'Post',
        data:{
            OPDId:document.getElementById('patientId').value,
            Name,
            Husband,
            Age,
            Village,
            Tahsil,
            District,
            State,
            DeliveryType,
            Gender,
            BirthTime,
            BirthDate,
            ChildWeight
        },
        success:function(data){
            window.open('/patients/birthCertificate/view/'+data.id)
            new Noty({
                theme: 'relax',
                text: data.message,
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
            return
        },
        error:function(err){
            new Noty({
                theme: 'relax',
                text: 'Unable to save',
                type: 'error',
                layout: 'topRight',
                timeout: 1500
            }).show();
            return
        }
    })
}


function setAutofillData(){
    let id = document.getElementById('patientId_search').value;
    if(!id || id == null || id == ''){
        new Noty({
            theme: 'relax',
            text: 'Patient id is empty',
            type: 'warning',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    $.ajax({
        url:'/patients/get/'+id,
        type:'GET',
        success:function(data){
            document.getElementById('Name').value = data.patient.Name,
            document.getElementById('Age').value = data.patient.Age,
            document.getElementById('Husband').value = data.patient.Husband;
        },
        error:function(err){
            new Noty({
                theme: 'relax',
                text: 'Unable to set patient data',
                type: 'warning',
                layout: 'topRight',
                timeout: 1500
            }).show();
            return
        }
    })
}