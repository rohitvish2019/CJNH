function getPurchaseHistory(){
    let startDate = document.getElementById('startDate').value
    let endDate = document.getElementById('endDate').value
    $.ajax({
        url:'/purchases/getHistory',
        data:{
            startDate,
            endDate
        },
        type:'Get',
        success:function(data){
            showPurchaseHistory(data.purchases)
        },
        error:function(err){}
    })
}


function showPurchaseHistory(purchases){
    let container = document.getElementById('medicines');
    container.innerHTML = ``;
    for(let i=0;i<purchases.length;i++){
        let rowItem = document.createElement('tr');
        rowItem.innerHTML=
        `
            <td>${i+1}</td>
            <td>${purchases[i].Name}</td>
            <td>${purchases[i].Batch}</td>
            <td>${purchases[i].Price}</td>
            <td>${purchases[i].Quantity}</td>
            <td>${purchases[i].Bought_Date}</td>
        `
        container.appendChild(rowItem);
    }
}