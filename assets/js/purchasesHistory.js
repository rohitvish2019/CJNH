function getPurchaseHistory(){
    let startDate = document.getElementById('startDate').value
    let endDate = document.getElementById('endDate').value
    let selectedDate = document.getElementById('selectedDate').value;
    $.ajax({
        url:'/purchases/getHistory',
        data:{
            type:document.getElementById('searchType').value,
            startDate,
            endDate,
            selectedDate,
            Item:document.getElementById('ItemName').value,
            Seller:document.getElementById('sellerName').value
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
    if(purchases.length < 1){
        let rowItem = document.createElement('tr');
        rowItem.innerHTML=`<td colspan = 9 >No data found</td>`
        container.appendChild(rowItem);
        return;
    }
    let total = 0;
    for(let i=0;i<purchases.length;i++){
        let rowItem = document.createElement('tr');
        rowItem.id=purchases[i]._id
        let price = purchases[i].Price == null ? 0 : parseInt(purchases[i].Price);
        let quantity = purchases[i].Quantity == null ? 0 : parseInt(purchases[i].Quantity)
        rowItem.innerHTML=
        `
            <td>${i+1}</td>
            <td>${purchases[i].Name}</td>
            <td>${purchases[i].Batch}</td>
            <td>${price}</td>
            <td>${quantity}</td>
            <td>${price*quantity}</td>
            <td>${purchases[i].Bought_Date.split('-')[2]}-${purchases[i].Bought_Date.split('-')[1]}-${purchases[i].Bought_Date.split('-')[0]}</td>
            <td>${purchases[i].Seller}</td>
            <td>${purchases[i].Category}</td>
            <td><button class="btn btn-danger" onclick="cancelPurchase('${purchases[i]._id}')"><i class="fa-solid fa-ban"></i></button></td>
        `
        total = total + (price*quantity);
        container.appendChild(rowItem);
    }
    document.getElementById('total').innerText='Total : '+ total
}

function changeInputs(){
    let selected = document.getElementById('searchType').value;
    if(selected == 'byDate'){
        document.getElementById('dateRangeInputs').style.display='none'
        document.getElementById('dateInput').style.display='block'
    }else if(selected == 'byDateRange'){
        document.getElementById('dateInput').style.display='none'
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

function printMe(){
    document.getElementById('header').style.display='none'
    //document.getElementById('searchElements').style.display='none'
    
    let selects = document.getElementsByTagName('select');
    for(let i=0;i<selects.length;i++){
        selects[i].style.display='none'
    }
    let inputs = document.getElementsByTagName('input');
    for(let i=0;i<inputs.length;i++){
        if(inputs[i].type != 'date'){
            inputs[i].style.display='none'
        }
        
    }
    let buttons = document.getElementsByClassName('btn');
    for(let i=0;i<buttons.length;i++){
        buttons[i].style.display='none'
    }
    window.print()
}