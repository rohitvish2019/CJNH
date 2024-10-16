$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});

function openDashboard(){
    document.getElementById('users').style.display='none'
    document.getElementById('settings').style.display='none'
    document.getElementById('profile').style.display='none'
    document.getElementById('dashboard').style.display='block'
}
function openUsers(){
    document.getElementById('users').style.display='block'
    document.getElementById('settings').style.display='none'
    document.getElementById('profile').style.display='none'
    document.getElementById('dashboard').style.display='none'
    getUsers()
}
function openSettings(){
    document.getElementById('users').style.display='none'
    document.getElementById('settings').style.display='flex'
    document.getElementById('profile').style.display='none'
    document.getElementById('dashboard').style.display='none'
    getServices()
}
function openProfile(){
    document.getElementById('users').style.display='none'
    document.getElementById('settings').style.display='none'
    document.getElementById('profile').style.display='block'
    document.getElementById('dashboard').style.display='none'
}

openSettings()

function getUsers(){
    $.ajax({
        url:'/user/getAllUsers',
        type:'Get',
        success:function(data){
            let container = document.getElementById('usersListTable');
            container.innerHTML=``;
            for(let i=0;i<data.usersList.length;i++){
                let user = data.usersList[i]
                let rowItem = document.createElement('tr');
                if(user.isValid == true){
                    rowItem.innerHTML=
                `
                    <td>${user.email}</td>
                    <td>${user.Name}</td>
                    <td>${user.Role}</td>
                    <td>
                        <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" onchange="enableDisableUser('${user._id}')" role="switch" id="checkbox_${user._id}" checked>
                        </div>
                    </td>
                    <td>Reset password</td>
                `
                }else{
                    rowItem.innerHTML=
                `
                    <td>${user.email}</td>
                    <td>${user.Name}</td>
                    <td>${user.Role}</td>
                    <td>
                        <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" onchange="enableDisableUser('${user._id}')" role="switch" id="checkbox_${user._id}">
                        </div>
                    </td>
                    <td>Reset password</td>
                `
                }
                
                container.appendChild(rowItem)
            }
        },
        error:function(err){
            console.log(err)
        }
    })
}


function getServices(){
    $.ajax({
        url:'/reports/getAllServices',
        type:'GET',
        success:function(data){
            let container = document.getElementById('services-list');
            container.innerHTML = ``;
            for(let i=0;i<data.services.length;i++){
                let service = data.services[i];
                let rowItem = document.createElement('div');
                rowItem.classList.add('input-group')
                rowItem.classList.add('mb-3');
                rowItem.innerHTML=
                `
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="${service._id+'name'}">${service.Name}</span>
                    </div>
                    <input id='${service._id+'price'}' class="input-group-value" onchange='markToUpdate("${service._id}")' type="text" class="form-control" placeholder="Amount" aria-label="Username" aria-describedby="basic-addon1" value='₹ ${service.Price}'>
                `
                container.appendChild(rowItem)
            }
        },
        error:function(req, res){
            console.log(err)
        }
    })
    
}
let valuesToUpdate = new Array();
function markToUpdate(id){
    let item = {
        id:id,
        Price: document.getElementById(id+'price').value.split('₹')[1]
    }
    valuesToUpdate.push(item);
}

function saveSettings(){
    $.ajax({
        url:'/reports/saveServiceSettings',
        data:{
            valuesToUpdate,
        },
        type:'POST',
        success:function(data){
            new Noty({
                theme: 'relax',
                text: 'Settings saved',
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
            return
        },
        error:function(err){
            new Noty({
                theme: 'relax',
                text: 'Unable to save settings',
                type: 'error',
                layout: 'topRight',
                timeout: 1500
            }).show();
            return
        }
    })
}


function AddNewService(){
    let Name= document.getElementById('Name').value
    let Category = document.getElementById('Category').value
    let Price = document.getElementById('Price').value
    let RefRange = document.getElementById('RefRange').value
    let Notes = document.getElementById('Notes').value
    $.ajax({
        url:'/reports/saveService',
        data:{
            Name,
            Category,
            Price,
            RefRange,
            Notes
        },
        type:'POST',
        success:function(data){
            new Noty({
                theme: 'relax',
                text: 'Service saved',
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();

            document.getElementById('Name').value = ''
            document.getElementById('Category').value = ''
            document.getElementById('Price').value = ''
            document.getElementById('RefRange').value = ''
            document.getElementById('Notes').value = ''
            return
        },
        error:function(err){
            new Noty({
                theme: 'relax',
                text: 'Unable to save service',
                type: 'error',
                layout: 'topRight',
                timeout: 1500
            }).show();
            return
        }
    })
}

function enableDisableUser(user){
    let message = '';
    let status = document.getElementById('checkbox_'+user).checked
    if(status){
        message ='User enabled'
    }else{
        message = 'User disabled'
    }
    $.ajax({
        url:'/user/changeStatus',
        data:{
            user,
            status
        },
        type:'Post',
        success:function(data){
            new Noty({
                theme: 'relax',
                text: message,
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
        },
        error: function(err){
            new Noty({
                theme: 'relax',
                text: 'Unable to change user status',
                type: 'error',
                layout: 'topRight',
                timeout: 1500
            }).show();
        }
    })
}