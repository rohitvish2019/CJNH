let tests = new Array();
let counter = 1
function addTest(){
    let container = document.getElementById('testsBody');
    let rowItem = document.createElement('tr');
    let testName, testResult, refRange;
    testName = document.getElementById('testName').value
    testResult = document.getElementById('testResult').value
    refRange = document.getElementById('refRange').value
    tests.push(testName+'$'+testResult+'$'+refRange);
    rowItem.innerHTML=
    `   <td>${counter}</td>
        <td>${testName}</td>
        <td>${refRange}</td>
        <td>${testResult}</td>
        <td>delete</td>
    `
    container.appendChild(rowItem);
    counter++;
}

function saveTests(){
    $.ajax({
        url:'/reports/save',
        data:{
            tests,
            id
        },  
        type:'Post',
        success:function(data){},
        error:function(err){}
    })
}

function autoFillPatients(){
    let id = document.getElementById('patientId')
    $.ajax({
        url:'/getPatientById/'+id,
        type:'Get',
        success:function(data){
            document.getElementById('patName').value=data.patient.Name;
            document.getElementById('age').value=data.patient.Age;
            document.getElementById('gender').value=data.patient.Gender;
            document.getElementById('address').value=data.patient.Address;
            document.getElementById('mobile').value=data.patient.Mobile;
            document.getElementById('docName').value=data.patient.Doctor;
        },
        error:function(data){}
    })
}

