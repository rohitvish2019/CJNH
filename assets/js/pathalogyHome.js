let tests = new Array();
let counter = 1
function addTest(){
    let container = document.getElementById('testsBody');
    let rowItem = document.createElement('tr');
    let testName, testResult, refRange,testCategory;
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
    $.ajax({
        url:'/reports/save',
        data:{
            tests,
            id,
            patient
        },  
        type:'Post',
        success:function(data){},
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

