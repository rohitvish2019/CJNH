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

function uploadReport(visitId, patient_id){
    var formData = new FormData();
    let file = document.getElementById('file').files[0];
    let timeStamp = Date.now()
    formData.append('file',file)
    console.log(file);
    var formData = new FormData();
    formData.append("visitId",visitId);
    formData.append("patientId",patient_id);
    formData.append("timeStamp", timeStamp);
    formData.append('fileName', document.getElementById('fileName').value)
    formData.append('file', document.getElementById('file').files[0]);
    let date = new Date().toLocaleDateString().split("/").join("_");
    let fileName = document.getElementById('fileName').value;
    let link = "/uploads/"+date+"/"+timeStamp+'_'+fileName+'.pdf'
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
