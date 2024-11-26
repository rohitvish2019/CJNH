function getPurchaseHistory(){
    let startDate = document.getElementById('startDate').value
    let endDate = document.getElementById('endDate').value
    $.ajax({
        url:'/purchases/getHistory',
        data:{
            type:document.getElementById('searchType').value,
            startDate,
            endDate,
            Item:document.getElementById('itemName').value
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
        rowItem.id=purchases[i]._id
        rowItem.innerHTML=
        `
            <td>${i+1}</td>
            <td>${purchases[i].Name}</td>
            <td>${purchases[i].Batch}</td>
            <td>${purchases[i].Price}</td>
            <td>${purchases[i].Quantity}</td>
            <td>${purchases[i].Bought_Date.split('-')[2]}-${purchases[i].Bought_Date.split('-')[1]}-${purchases[i].Bought_Date.split('-')[0]}</td>
            <td>${purchases[i].Seller}</td>
            <td><button onclick="cancelPurchase('${purchases[i]._id}')">cancel</button></td>
        `
        container.appendChild(rowItem);
    }
}

function changeInputs(){
    let selected = document.getElementById('searchType').value;
    if(selected == 'byItem'){
        document.getElementById('dateRangeInputs').style.display='none'
        document.getElementById('itemNameInputs').style.display='block'
    }else if(selected == 'byDateRange'){
        document.getElementById('itemNameInputs').style.display='none'
        document.getElementById('dateRangeInputs').style.display='block'
    }
}

function cancelPurchase(id){
    let confirmation = window.confirm('Purchase will be cancelled permanently !!!')
    if(confirmation){
        $.ajax({
            url:'/purchases/cancel/'+id,
            type:'POST',
            success:function(data){
                document.getElementById(id).remove();
            },
            error:function(err){
    
            }
        })
    }
}