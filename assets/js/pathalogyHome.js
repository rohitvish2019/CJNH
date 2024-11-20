let tests = new Array();
let counter = 1
let services = new Array();

function addTest() {
    let container = document.getElementById('testsBody');
    let rowItem = document.createElement('tr');
    let testName
    let testResult = ''
    let refRangeMin = -1
    let refRangeMax = -1
    let refRangeUnit = ''
    let testCategory = 'Others';
    
    testName = document.getElementById('testName').value
    testResult = document.getElementById('testResult').value
    refRangeMin = document.getElementById('rrmin').value
    refRangeMax = document.getElementById('rrmax').value
    refRangeUnit = document.getElementById('rrunit').value
    testCategory = document.getElementById('category').value
    if(testName == '' || testResult == ''){
        new Noty({
            theme: 'relax',
            text: 'Mandatory details are missing',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    tests.push(testName + '$' + testResult + '$' + testCategory + '$' + refRangeMin + '$' + refRangeMax + '$' + refRangeUnit);
    rowItem.id = 'rowItem_' + counter
    rowItem.innerHTML =
        `   <td>${counter}</td>
        <td>${testName}</td>
        <td>${refRangeMin}</td>
        <td>${refRangeMax}</td>
        <td>${refRangeUnit}</td>
        <td>${testResult}</td>
        <td>${testCategory}</td>
        <td>
                <label id="dustbinDark${counter}" onmouseover = "highlight(${counter})" onmouseout = "unhighlight(${counter})" style="display:inline-block; margin: 1%;" onclick="deleteItem(${counter})"><i class="fa-solid fa-trash-can"></i> </label>
                <label id="dustbinLight${counter}" onmouseover = "highlight(${counter})" onmouseout = "unhighlight(${counter})" style="display:none; margin: 1%;" onclick="deleteItem(${counter})"><i class="fa-regular fa-trash-can"></i> </label>
            </td>
    `
    container.appendChild(rowItem);
    counter++;
    document.getElementById('testName').value = ''
    document.getElementById('testResult').value = ''
    document.getElementById('rrmin').value = ''
    document.getElementById('rrmax').value = ''
    document.getElementById('rrunit').value = ''
    document.getElementById('category').value = 'OTHERS'
}

function unhighlight(x) {
    document.getElementById('dustbinDark'+x).style.display = "block";
    document.getElementById('dustbinLight'+x).style.display = "none";
}

function highlight(x) {
    document.getElementById('dustbinDark'+x).style.display = "none";
    document.getElementById('dustbinLight'+x).style.display = "block";
}

function deleteItem(counter) {
    tests.splice(counter - 1, 1, '');
    document.getElementById('rowItem_' + counter).remove()
}

function saveTests() {
    let id = document.getElementById('patientId').value;
    let patient = {
        Name: document.getElementById('patName').value,
        Age: document.getElementById('age').value,
        Gender: document.getElementById('gender').value,
        Address: document.getElementById('address').value,
        Mobile: document.getElementById('mobile').value,
        Doctor: document.getElementById('docName').value,
    }

    console.log('TEST')
    console.log(patient)
    if (patient.Name == '' || patient.Age == '' || patient.Gender == '' || patient.Address == '' || patient.Mobile == '' || patient.Doctor == '') {
        new Noty({
            theme: 'relax',
            text: 'All Patient details are mandatory',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    if (tests.length < 1) {
        new Noty({
            theme: 'relax',
            text: 'Can not save empty report',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    let billNumber = window.prompt('Please enter bill number to continue');
    console.log(billNumber)
    $.ajax({
        url:'/sales/validateBill/',
        data:{
            billNumber,
            Name:patient.Name
        },
        type:'GET',
        success:function(data){
            console.log("Printing reponse from validation call")
            console.log(data)
            if(data.isValid == true){
                $.ajax({
                    url: '/reports/save',
                    data: {
                        tests,
                        id,
                        patient
                    },
                    type: 'Post',
                    success: function (data) {
                        window.open('/reports/view/' + data.report_id);
                        window.location.href = '/reports/new/home'
            
                    },
                    error: function (err) {}
                })
            }else{
                new Noty({
                    theme: 'relax',
                    text: 'Bill details are not matching',
                    type: 'error',
                    layout: 'topRight',
                    timeout: 1500
                }).show();
                return
            }
            
        },
        error:function(err){}

    })
    
}

function autoFillPatients() {
    let id = document.getElementById('patientId').value
    $.ajax({
        url: '/patients/getPatientById/' + id,
        type: 'Get',
        success: function (data) {

            document.getElementById('patName').value = data.patient.Name;
            document.getElementById('age').value = data.patient.Age;
            document.getElementById('gender').value = data.patient.Gender;
            document.getElementById('address').value = data.patient.Address;
            document.getElementById('mobile').value = data.patient.Mobile;
            document.getElementById('docName').value = data.patient.Doctor;
            new Noty({
                theme: 'relax',
                text: 'Patient setup done',
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
        },
        error: function (data) {
            document.getElementById('patName').value = '';
            document.getElementById('age').value = '';
            document.getElementById('gender').value = '';
            document.getElementById('address').value = '';
            document.getElementById('mobile').value = '';
            document.getElementById('docName').value = '';
            document.getElementById('patientId').value = ''
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

function setRefRange() {
    let name = document.getElementById('testName').value;
    getServiceByName(name)

}

function getServiceByName(name) {
    $.ajax({
        url: '/reports/getServiceByName/',
        type: 'Get',
        data: {
            name
        },
        success: function (data) {
            document.getElementById('rrmin').value = data.service.RefRangeMin == undefined ? '' : data.service.RefRangeMin
            document.getElementById('rrmax').value = data.service.RefRangeMax == undefined ? '' : data.service.RefRangeMax
            document.getElementById('rrunit').value = data.service.RefRangeUnit == undefined ? '' : data.service.RefRangeUnit
            document.getElementById('category').value = data.service.Category == undefined ? '' : data.service.Category;
            document.getElementById('testResult').value = ''
        },
        error: function (err) {}
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