function loadTestsByReport(){
    let reportNo = document.getElementById('reportNo').value;
    $.ajax({
        url:'/reports/getByReportNumber',
        data:{
            reportNo
        },
        type:'GET',
        success:function(data){
            let container = document.getElementById('pathlogyTests');
            container.innerHTML=``;
            for(let i=0;i<data.report.length;i++){
                let rowItem = document.createElement('tr');
                let item = data.report[i].split('$');
                rowItem.innerHTML=
                `
                <td>${item[0]}</td>
                <td>${item[2]}</td>
                <td>${item[1]}</td>
                <td>Delete</td>
                `
                container.appendChild(rowItem)
            }
            console.log(data)
        },
        error:function(err){}
    })
}


function loadDefaultTests(){
    $.ajax({
        url:'/reports/getDefaultTests',
        type:'GET',
        success:function(data){
            console.log(data.report)
            let container = document.getElementById('pathlogyTests');
            container.innerHTML=``;
            for(let i=0;i<data.report.length;i++){
                let rowItem = document.createElement('tr');
                rowItem.innerHTML=
                `
                <td>${data.report[i].Name}</td>
                <td>${data.report[i].RefRange}</td>
                <td><input type='text'></td>
                <td>Delete</td>
                `
                container.appendChild(rowItem)
            }
            console.log(data)
        },
        error:function(err){}
    })
}

function loadDefaultDischargeTreatments(){
    $.ajax({
        url:'/reports/getDefaultDischargeTreatments',
        type:'GET',
        success:function(data){
            console.log(data.report)
            let container = document.getElementById('pathlogyTests');
            container.innerHTML=``;
            for(let i=0;i<data.report.length;i++){
                let rowItem = document.createElement('tr');
                rowItem.innerHTML=
                `
                <td>${data.report[i].Name}</td>
                <td>${data.report[i].RefRange}</td>
                <td><input type='text'></td>
                <td>Delete</td>
                `
                container.appendChild(rowItem)
            }
            console.log(data)
        },
        error:function(err){}
    })
}
loadDefaultDischargeTreatments()
loadDefaultTests()