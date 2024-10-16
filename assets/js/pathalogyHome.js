let tests = new Array();
let counter = 1
let services = new Array();
function addTest(){
    let container = document.getElementById('testsBody');
    let rowItem = document.createElement('tr');
    let testName
    let testResult = ''
    let refRange = ''
    let testCategory = 'Others';
    testName = document.getElementById('testName').value
    testResult = document.getElementById('testResult').value
    refRange = document.getElementById('refRange').value
    testCategory = document.getElementById('category').value
    tests.push(testName+'$'+testResult+'$'+refRange+'$'+testCategory);
    rowItem.innerHTML=
    `   <td>${counter}</td>
        <td>${testName}</td>
        <td>${refRange}</td>
        <td>${testResult}</td>
        <td>${testCategory}</td>
        <td>delete</td>
    `
    container.appendChild(rowItem);
    counter++;
    document.getElementById('testName').value=''
    document.getElementById('testResult').value=''
    document.getElementById('refRange').value=''
    document.getElementById('category').value=''
}

function saveTests(){
    let id = document.getElementById('patientId').value;
    let patient = {
        Name : document.getElementById('patName').value,
        Age : document.getElementById('age').value,
        Gender : document.getElementById('gender').value,
        Address : document.getElementById('address').value,
        Mobile : document.getElementById('mobile').value,
        Doctor : document.getElementById('docName').value,
    }
    
    console.log('TEST')
    console.log(patient)
    if(patient.Name == '' || patient.Age == '' || patient.Gender == '' || patient.Address == '' || patient.Mobile == '' || patient.Doctor == ''){
        new Noty({
            theme: 'relax',
            text: 'All Patient details are mandatory',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    if(tests.length < 1){
        new Noty({
            theme: 'relax',
            text: 'Can not save empty report',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    $.ajax({
        url:'/reports/save',
        data:{
            tests,
            id,
            patient
        },  
        type:'Post',
        success:function(data){
            window.open('/reports/view/'+data.report_id);
            window.location.href='/reports/new/home'
    
        },
        error:function(err){}
    })
}

function autoFillPatients(){
    let id = document.getElementById('patientId').value
    $.ajax({
        url:'/patients/getPatientById/'+id,
        type:'Get',
        success:function(data){
            
            document.getElementById('patName').value=data.patient.Name;
            document.getElementById('age').value=data.patient.Age;
            document.getElementById('gender').value=data.patient.Gender;
            document.getElementById('address').value=data.patient.Address;
            document.getElementById('mobile').value=data.patient.Mobile;
            document.getElementById('docName').value=data.patient.Doctor;
            new Noty({
                theme: 'relax',
                text: 'Patient setup done',
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
        },
        error:function(data){
            document.getElementById('patName').value='';
            document.getElementById('age').value='';
            document.getElementById('gender').value='';
            document.getElementById('address').value='';
            document.getElementById('mobile').value='';
            document.getElementById('docName').value='';
            document.getElementById('patientId').value=''
            new Noty({
                theme: 'relax',
                text: 'No data found',
                type: 'warning',
                layout: 'topRight',
                timeout: 1500
            }).show();
        }
    })
}

function setRefRange(){
    let name = document.getElementById('testName').value;
    getServiceByName(name)
    
}

function getServiceByName(name){
    $.ajax({
        url:'/reports/getServiceByName/',
        type:'Get',
        data:{
            name
        },
        success:function(data){
            document.getElementById('refRange').value = data.service.RefRange == undefined ?'':data.service.RefRange
            document.getElementById('category').value = data.service.Category == undefined ? '':data.service.Category;
            document.getElementById('testResult').value = ''
        },
        error:function(err){}
    })
}
/*
its too complicated

function setSavedItems(){
    let id = document.getElementById('billId').value;
    $.ajax({
        url:'/sales/bill/view/'+id,
        type:'GET',
        success:function(data){
            tests = data.bill.Items;
            let container = document.getElementById('testsBody');
            container.innerHTML=``;
            for(let i=0;i<tests.length;i++){
                let rowItem = document.createElement('tr');
                let item = items[i].split('$')
                rowItem.innerHTML=
                `
                    <td>${i+1}</td>
                    <td>${item[0]}</td>
                    <td>${item[0]}</td>
                    <td>${item[0]}</td>
                    <td>${item[0]}</td>
                    <td>${item[0]}</td>
                `
            }
        },
        error:function(err){console.log(err)}
    })
}

setSavedItems()
*/

