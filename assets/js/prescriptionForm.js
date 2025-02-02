let medCounter = 1
let changes = new Object();
let prescribedMeds = new Array();

function printPrescription() {
    document.getElementById('printButton').style.display = 'none'
    changes['complaint'] = document.getElementById('complaint').value
    changes['history'] = document.getElementById('history').value
    changes['OEs'] = document.getElementById('OEs').value
    $.ajax({
        url: '/patients/saveVisitPrescriptions',
        data: {
            visitId: document.getElementById('visitId').innerText,
            visitData: changes,
            prescribedMeds : removeEmptyValuesFromArray(prescribedMeds)
        },
        type: 'POST',
        success: function (data) {
            
            let items = document.getElementsByTagName('textarea');
            for (let i = 0; i < items.length; i++) {
                items[i].style.borderLeft = 'none'
                items[i].style.borderBottom = '1px solid black'
            }
            document.getElementById('OtherAdvice').style.border='none'
            document.getElementById('searchBox').style.display = 'none'
            document.getElementById('AddMed').style.display = 'none'
            document.getElementById('fileInputs').style.display='none'
            window.print()
        }
    })
}

function removeEmptyValuesFromArray(inputArray){
    let outputArray = new Array()
    for(let i=0;i<inputArray.length;i++){
        if(inputArray[i] != ''){
            outputArray.push(inputArray[i])
        }
    }
    return outputArray;
}

function getVisitdata() {
    $.ajax({
        url: '/patients/getPrescription/' + document.getElementById('visitId').innerText,
        type: 'Get',
        success: function (data) {
            
            if(data && data.visitData){
                let keys = Object.keys(data.visitData)
                changes = data.visitData
                for (let i = 0; i < keys.length; i++) {
                    document.getElementById(keys[i]).value = data.visitData[keys[i]]
                }
                let container = document.getElementById('prescribedMeds');
                for (let i = 0; i < data.Prescriptions.length; i++) {
                    let item = document.createElement('tr');
                    let itemInfo = data.Prescriptions[i]
                    itemData = itemInfo.split('$')
                    item.id = removeSpaces(itemInfo)+'_tr'
                    item.innerHTML=
                    `
                        <td style="width: 40%;" ondblclick='deleteMed("${removeSpaces(itemInfo)}","${itemInfo}")' >
                            <label style="display: block;">${itemData[0]}</label>
                            <small style="font-size: 10px !important;"><b>Comp. </b>${itemData[3] == undefined ? '':itemData[3]}</small>
                        </td>
                        <td style="width: 10%;">
                            ${itemData[1] == undefined ? '' : itemData[1]}
                        </td>
                        <td style="font-size: 12px;width: 40%;">
                            ${itemData[2] == undefined ? '' : itemData[2]}
                        </td>
                    `
                    container.appendChild(item);
                    prescribedMeds.push(data.Prescriptions[i])
                }
                calculateFullGAA()
            }
        },
        error: function (err) {
            console.log(err)
        }
    })
}

function addChanges(id) {
    changes[id] = document.getElementById(id).value
}

function addMed() {
    let container = document.getElementById('prescribedMeds');
    let item = document.createElement('tr');
    let itemInfo = document.getElementById('searchBox').value
    let itemData = itemInfo.split('$')
    item.innerHTML=
    `
    
    <td style="width: 40%;" ondblclick='deleteMed("${removeSpaces(itemInfo)}","${itemInfo}")' >
        <label style="display: block;">${itemData[0]}</label>
        <small style="font-size: 10px !important;"><b>Comp. </b>${itemData[3]==undefined ? '':itemData[3]}</small>
    </td>
    <td style="width: 10%;">
        ${itemData[1] == undefined ? '' : itemData[1]}
    </td>
    <td style="font-size: 12px;width: 40%;">
        ${itemData[2] == undefined ? '' : itemData[2]}
    </td>
    
    `
    /*
        <li id='${removeSpaces(itemData)}_li' ondblclick='deleteMed("${removeSpaces(itemData)}","${itemData}")' >${itemData}</li>
    */
    item.style.fontSize = '14px'
    item.id = removeSpaces(itemInfo)+'_tr'
    item.style.cursor='grab'
    container.appendChild(item);
    prescribedMeds.push(itemInfo)
    document.getElementById('searchBox').value = "";
}

function deleteMed(id, value){
    let confirmation = window.confirm('Delete '+value+'?');
    console.log(confirmation);
    if(confirmation){
        let index = prescribedMeds.indexOf(value);
        if(index > -1){
            prescribedMeds[index]= '';
        }
        document.getElementById(id+'_tr').remove()
    }
    
}


function removeSpaces(data){
    let dataArray = data.split(' ');
    return dataArray.join('_');
}


function saveWeight(visitId){
    $.ajax({
        url:'/patients/saveWeight',
        data:{
            visitId,
            weight:document.getElementById('pweight').value
        },
        type:'POST'
    })
}

function setname(){
    let file = document.getElementById('file').files[0];
    document.getElementById('fileName').value = file.name
}
function uploadReport(visitId, patient_id){
    let fname = document.getElementById('fileName').value;
    let file = document.getElementById('file').files[0];
    if(fname == '' || !file){
        new Noty({
            theme: 'relax',
            text: 'Invalid input',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    var formData = new FormData();
    let timeStamp = Date.now()
    formData.append('file',file)
    var formData = new FormData();
    formData.append("visitId",visitId);
    formData.append("patientId",patient_id);
    formData.append("timeStamp", timeStamp);
    formData.append('fileName', document.getElementById('fileName').value)
    formData.append('file', document.getElementById('file').files[0]);
    let date = new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'2-digit',year:'numeric'}).split("/").join("_");
    let fileName = document.getElementById('fileName').value;
    let link = "/uploads/"+date+"/"+timeStamp+'_'+fileName
    $.ajax({
        url : '/uploads/report',
        type : 'POST',
        data : formData,
        processData: false,   // tell jQuery not to process the data            
        contentType: false,  // tell jQuery not to set contentType            
        success : function(data) { 
            let container= document.getElementById('otherDocs');
            let item = document.createElement('tr');
            item.innerHTML=
            `
                <td><a href='${link}' target='_blank'>${fileName}</a></td>
            `    
            container.appendChild(item)
            document.getElementById('fileName').value=''
            document.getElementById('file').files[0] = null
        }
    });
        
  }
  let speechToTextResultDiv;
  function speechToText(){
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Your browser does not support Speech Recognition. Please use a modern browser like Chrome.");
    } else {
        const recognition = new SpeechRecognition();
        const startButton = document.getElementById('startButton');
        const stopButton = document.getElementById('stopButton');
        

        // Set recognition properties
        recognition.lang = 'en-US'; // Language set to English (US)
        recognition.interimResults = false; // Complete results only
        recognition.continuous = false; // Stop after one utterance

        // Start recognition
        startButton.addEventListener('click', () => {
            recognition.start();
            startButton.disabled = true;
            stopButton.disabled = false;
            speechToTextResultDiv.textContent = "Listening...";
        });

        // Stop recognition
        stopButton.addEventListener('click', () => {
            recognition.stop();
            startButton.disabled = false;
            stopButton.disabled = true;
        });

        // Process recognition result
        recognition.addEventListener('result', (event) => {
            const transcript = event.results[0][0].transcript;
            speechToTextResultDiv.textContent = `${transcript}`;
        });

        // Handle recognition errors
        recognition.addEventListener('error', (event) => {
            console.error('Speech recognition error:', event.error);
            speechToTextResultDiv.textContent = `Error: ${event.error}`;
            startButton.disabled = false;
            stopButton.disabled = true;
        });

        // Handle recognition end
        recognition.addEventListener('end', () => {
            startButton.disabled = false;
            stopButton.disabled = true;
        });
    }

  }
document.addEventListener('click', () => {
    const activeElement = document.activeElement;
    if (activeElement.id) {
        console.log('The ID of the currently focused element:', activeElement.id);
        setResultDivForSpeechToText(activeElement.id)
    } else {
        console.log('The currently focused element has no ID.');
    }
});
function setResultDivForSpeechToText(id){
speechToTextResultDiv = document.getElementById(id);
}
function addDaysToDate(inputDate, daysToAdd) {
    // Parse the input date string into a Date object
    let date = new Date(inputDate);

    // Add the specified number of days
    date.setDate(date.getDate() + daysToAdd);

    // Format the result as YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

/*
function countWeeksAndDays() {
    
    let startDate = document.getElementById('lmpdate').value
    let endDate =new Date().getFullYear()+"-"+(parseInt(new Date().getMonth())+1).toString().padStart(2,'0')+'-'+(parseInt(new Date().getDate())+1).toString().padStart(2,'0')
     
    // Parse the dates into JavaScript Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);
    console.log("Start date is "+startDate);
    console.log("End date is "+endDate)
    // Check if either of the dates is invalid
    if (isNaN(start) || isNaN(end)) {
        console.error("One or both of the provided dates are invalid.");
        return null;
    }

    // Ensure the end date is after or equal to the start date
    if (end < start) {
        console.error("End date should be greater than or equal to start date.");
        return null;
    }

    // Calculate the difference in milliseconds
    const diffInMillis = end - start;

    // Convert milliseconds to days
    const diffInDays = diffInMillis / (1000 * 60 * 60 * 24);

    // Calculate the number of weeks and remaining days
    const weeks = Math.floor(diffInDays / 7);
    const days = diffInDays % 7;

    // If the dates are the same
    if (diffInDays === 0) {
        return { weeks: 0, days: 0 };
    }

    document.getElementById('calculatedTime').innerHTML='GA(EDD) : '+ weeks + ' Weeks and '+ days + ' days'
}

*/

function calculateFullGAA() {
    let EDD = document.getElementById('cedddate').value
    // Validate EDD format (YYYY-MM-DD)
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    
    if (!datePattern.test(EDD)) {
      throw new Error("Invalid date format. Please use 'YYYY-MM-DD'.");
    }
      
    
    // Convert EDD (Expected Due Date) to a Date object
    const eddDate = new Date(EDD);
    
    // Check if the EDD is a valid date
    
    if (isNaN(eddDate)) {
      throw new Error("Invalid date. Please provide a valid date.");
    }
    
  
    // Subtract 40 weeks (280 days) from EDD to get the start of the pregnancy
    const pregnancyStartDate = new Date(eddDate);
    pregnancyStartDate.setDate(eddDate.getDate() - 280); // 40 weeks * 7 days = 280 days
  
    // Get today's date
    const today = new Date();
    //today.setHours(0, 0, 0, 0); // Set the time to midnight for accurate comparison
  
    // Ensure that the pregnancy start date is not in the future
    if (pregnancyStartDate > today) {
      throw new Error("pregnancy Start Date cannot be in the future. Please provide a valid EDD.");
    }
  
    // Calculate the difference in time between today and the pregnancy start date
    const timeDifference = today - pregnancyStartDate;
  
    // Convert the time difference to days
    const daysDifference = timeDifference / (1000 * 3600 * 24);
  
    // Calculate the full weeks and remaining days
    const fullWeeks = Math.floor(daysDifference / 7);
    const remainingDays = Math.floor(daysDifference % 7);
  
    // Return the full GAA as weeks and days
    document.getElementById('calculatedTime').value= fullWeeks + ' Weeks and '+ remainingDays + ' days'

  }

function updateEdd(){
    document.getElementById('edddate').value = addDaysToDate(document.getElementById('lmpdate').value, 280);
}

function initilizeApp(){
    getVisitdata()
    setTimeout(calculateFullGAA, 1000);
    addChanges('cedddate')
    addChanges('edddate')
    addChanges('lmpdate')
    addChanges('calculatedTime')
    //calculateFullGAA()
    speechToText()
}