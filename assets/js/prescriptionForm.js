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
            
            document.getElementById('searchBox').style.display = 'none'
            document.getElementById('AddMed').style.display = 'none'
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
                    let item = document.createElement('div');
                    
                    itemData = data.Prescriptions[i]
                    item.id = removeSpaces(itemData)+'_div'
                    item.innerHTML=
                    `
                        <li id='${removeSpaces(itemData)}_li' ondblclick='deleteMed("${removeSpaces(itemData)}","${itemData}")' >${itemData}</li>
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
    let item = document.createElement('div');
    let itemData = document.getElementById('searchBox').value
    item.innerHTML=
    `
        <li id='${removeSpaces(itemData)}_li' ondblclick='deleteMed("${removeSpaces(itemData)}","${itemData}")' >${itemData}</li>
    `
    item.style.fontSize = '14px'
    item.id = removeSpaces(itemData)+'_div'
    item.style.cursor='grab'
    container.appendChild(item);
    prescribedMeds.push(itemData)
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
        document.getElementById(id+'_div').remove()
    }
    
}


function removeSpaces(data){
    let dataArray = data.split(' ');
    return dataArray.join('_');
}
