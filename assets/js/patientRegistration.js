let inputData = ['Name', 'Gender', 'Age', 'Address', 'Mobile', 'Fees', 'Doctor','Husband','AppointmentDate','IdProof','paymentType'];

function registerPatient() {
    document.getElementById('register').setAttribute('disabled','true');
    let data = {}

    for (let i = 0; i < inputData.length; i++) {
        data[inputData[i]] = document.getElementById(inputData[i]).value;
        if (inputData[i] != 'IdProof' && (document.getElementById(inputData[i]).value == null || document.getElementById(inputData[i]).value == '' )) {
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
        url: '/patients/addVisit',
        type: 'POST',
        data: data,
        success: function (data) {
            console.log(data)
            new Noty({
                theme: 'relax',
                text: data.message,
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
            for (let i = 0; i < inputData.length; i++) {
                document.getElementById(inputData[i]).value = ''
            }
            window.open('/sales/bill/view/' + data.visit)
            window.location.href = '/patients/new'
        },
        error: function (err) {
            console.log(err.responseText)
        }
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
                if (document.getElementById(inputData[i])) {
                    document.getElementById(inputData[i]).value = data.patient[inputData[i]];
                }
            }
            let visitDate = data.visit[0].createdAt.toString().split('T')[0].split('-');
            let today = new Date();
            let lastVisitDate = new Date(data.visit[0].createdAt)
            let daysBetween = Math.floor(Math.abs(today-lastVisitDate) / (1000*86400));
            let todaysFees = 400;
            
            if(daysBetween < 31){
                todaysFees = 200
            }
            let day = new Date().getDay();
            if(day == 0){
                todaysFees = 500
            }
            let date = new Date().getFullYear() + '-' + (Number(new Date().getMonth()) + 1).toString().padStart(2,'0') + '-' + new Date().getDate().toString().padStart(2,'0')
            document.getElementById('Fees').value = todaysFees
            document.getElementById('lastFeesPaid').innerText = data.visit[0].Fees
            document.getElementById('lastVisitDate').innerText = visitDate[2] + '-' + visitDate[1] + '-' + visitDate[0]
            document.getElementById('register').setAttribute('disabled', 'true');
            document.getElementById('bookAppointment').removeAttribute('disabled')
            console.log(date)
            document.getElementById('AppointmentDate').value=date
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
            document.getElementById('Fees').value = 400 
            document.getElementById('patientID').value ='';
            document.getElementById('lastFeesPaid').innerText = 'NA'
            document.getElementById('lastVisitDate').innerText = 'NA'

            document.getElementById('bookAppointment').setAttribute('disabled', 'true');
            document.getElementById('register').removeAttribute('disabled');
        }
    })
}


function bookAppointmentWithId() {
    document.getElementById('bookAppointment').setAttribute('disabled','true');
    let fees = document.getElementById('Fees').value;
    let AppointmentDate = document.getElementById('AppointmentDate').value;
    let paymentType = document.getElementById('paymentType').value;
    let Doctor = document.getElementById('Doctor').value
    IdProof = document.getElementById('IdProof').value
    let patient = new Object();
    if (!fees || fees == '') {
        new Noty({
            theme: 'relax',
            text: 'Fees is mandatory',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    if (!AppointmentDate || AppointmentDate == '') {
        new Noty({
            theme: 'relax',
            text: 'Appointment Date is mandatory',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    if (!Doctor || Doctor == '') {
        new Noty({
            theme: 'relax',
            text: 'Doctor is mandatory',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    if (!paymentType || paymentType == '') {
        new Noty({
            theme: 'relax',
            text: 'Payment Type is mandatory',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    for(let i=0;i<inputData.length;i++){
        patient[inputData[i]] = document.getElementById(inputData[i]).value;
    }
    $.ajax({
        url: '/patients/visits/bookToday',
        type: 'Post',
        data: {
            PatientId: document.getElementById('patientID').value,
            date: AppointmentDate,
            Fees: fees,
            patient,
            Doctor,
            paymentType,
            IdProof,
        },
        success: function (data) {
            new Noty({
                theme: 'relax',
                text: data.message,
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
            for (let i = 0; i < inputData.length; i++) {
                if (document.getElementById(inputData[i])) {
                    document.getElementById(inputData[i]).value = '';
                }
            }
            document.getElementById('patientID').value ='';

            window.open('/sales/bill/view/' + data.visit)
            window.location.href = '/patients/new'
        },
        error: function (err) {
            new Noty({
                theme: 'relax',
                text: 'Unable to add visit',
                type: 'error',
                layout: 'topRight',
                timeout: 1500
            }).show();
        }
    })
}