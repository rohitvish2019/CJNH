function getAllVisits(){
    $.ajax({
        url:'/patients/getAllVisits/'+document.getElementById('patientID').innerText,
        type:'Get',
        success:function(data){
            for(let k=0;k<data.visits.length;k++){
                
                if(data.visits[k].VisitData == null){
                    continue
                }
                let visitData = replaceUndefinedValues(data.visits[k].VisitData)
                console.log(visitData)
                let visitsContainer = document.getElementById('visit-container')
                let cardContainer = document.createElement('div');
                cardContainer.classList.add('cardOne')
                cardContainer.innerHTML=
                `
                <div>
                <div class="card-header text-white">
                    <h2 class="h5 mb-0"><i class="fas fa-calendar-alt"></i> Visit Date: ${data.visits[k].Visit_date.split('-')[2]+'-'+data.visits[k].Visit_date.split('-')[1]+'-'+data.visits[k].Visit_date.split('-')[0]}</h2>
                </div>
                <div class="card-body">
                    <div style="display: flex; height: 200px; justify-content: space-between;">
                        <div class="information">
                            <b>Complaint :</b>
                            <textarea disabled rows="6" cols="60" name="" id="investigation" placeholder="">${visitData.complaint}</textarea>
                        </div>
                        <div class="information">

                            <b>History:</b>
                            <textarea disabled rows="6" cols="60" name="" id="complications" placeholder="">${visitData.history}</textarea>
                        </div>
                        <div class="information">

                            <b>O/E:</b>
                            <textarea disabled rows="6" cols="60" name="" id="otherInfo" placeholder="">${visitData.OEs}</textarea>
                        </div>
                    </div>

                    <div class="table-responsive">
                        <h5><i class="fa-solid fa-syringe"></i> <strong>Test Results</strong></h5>
                        <table class="table table-bordered">
                            <thead>
                                <tr class="bg">
                                    <th>CBC</th>
                                    <th>Bl gr & Rh</th>
                                    <th>RBS</th>
                                    <th>HIV</th>
                                    <th>HBsAg</th>
                                    <th>TSH</th>
                                    <th>Urine P.test</th>
                                    <th>Urine-R/M</th>
                                    <th>Urine-Culture & Sensitivity</th>
                                    <th>USG Obst</th>
                                    <th>USG -Colour Dop.</th>
                                    <th>USG - L.Abd</th>
                                    <th>USG - W.Abd</th>
                                    <th>Semen Analysis</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="bg">
                                    <td id="CBC">${visitData['CBC'] == undefined ? '' : visitData['CBC']}</td>
                                    <td id="Blgr">${visitData['Blgr'] == undefined ? '' : visitData['Blgr']}</td>
                                    <td id="RBS">${visitData['RBS'] == undefined ? '' : visitData['RBS']}</td>
                                    <td id="HIV">${visitData['HIV'] == undefined ? '' : visitData['HIV']}</td>
                                    <td id="HBsAg">${visitData['HBsAg'] == undefined ? '' : visitData['HBsAg']}</td>
                                    <td id="TSH">${visitData['TSH'] == undefined ? '' : visitData['TSH']}</td>
                                    <td id="Urine-Ptest">${visitData['Urine-Ptest'] == undefined ? '' : visitData['Urine-Ptest']}</td>
                                    <td id="Urine-RM">${visitData['Urine-RM'] == undefined ? '' : visitData['Urine-RM']}</td>
                                    <td id="Urine-Culture">${visitData['Urine-CultureSens'] == undefined ? '' : visitData['Urine-CultureSens']}</td>
                                    <td id="USG-Obst">${visitData['USG-Obst'] == undefined ? '' : visitData['USG-Obst']}</td>
                                    <td id="USG-ColourDop">${visitData['USG-ColourDop'] == undefined ? '' : visitData['USG-ColourDop']}</td>
                                    <td id="USG-LAbd">${visitData['USG-LAbd'] == undefined ? '' : visitData['USG-LAbd']}</td>
                                    <td id="USG-WAbd">${visitData['USG-WAbd'] == undefined ? '' : visitData['USG-WAbd']}</td>
                                    <td id="SemenAnalysis">${visitData['SemenAnalysis'] == undefined ? '' : visitData['SemenAnalysis']}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="table">
                        <h5><strong><i class="fas fa-calendar-alt"></i> Miscellaneous</strong></h5>
                        <table class="table table-bordered">
                            <thead>
                                <tr class="bg">
                                    <th>T1</th>
                                    <th>T2</th>
                                    <th>NT on</th>
                                    <th>TS on</th>
                                    <th>CD on</th>
                                    <th>Follow up on</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="bg">
                                    <td id="T1">${visitData.T1 == undefined ? '' : visitData.T1}</td>
                                    <td id="T2">${visitData.T2 == undefined ? '' : visitData.T2}</td>
                                    <td id="NT">${visitData.NT == undefined ? '' : visitData.NT}</td>
                                    <td id="TS">${visitData.TS == undefined ? '' : visitData.TS}</td>
                                    <td id="CD">${visitData.CD == undefined ? '' : visitData.CD}</td>
                                    <td id="FUP">${visitData.FUP == undefined ? '' : visitData.FUP}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
                `
                visitsContainer.appendChild(cardContainer)
                /*let keys = Object.keys(visitData);
                for(let i=0;i<keys.length;i++){
                    if(document.getElementById(keys[i])){
                        document.getElementById(keys[i]).innerText=visitData[keys[i]]
                    }
                    
                }
                    */
            }
            /*
            
            let keys = Object.keys(data.visitData)
            
            console.log(data.visits);
            */
        },
        error:function(err){
            console.log(err)
        }
    })
}

function replaceUndefinedValues(obj) {
    // Iterate over the keys of the object
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        // Check if the value is undefined
        if (obj[key] === undefined) {
          // Replace with an empty string
          obj[key] = '';
        }
      }
    }
    return obj;
  }