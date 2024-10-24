$("#menu-toggle").click(function (e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});
openDashboard()

function openDashboard() {
    document.getElementById('users').style.display = 'none'
    document.getElementById('settings').style.display = 'none'
    document.getElementById('profile').style.display = 'none'
    document.getElementById('dashboard').style.display = 'block'
    getDashboardData()
}

function openUsers() {
    document.getElementById('users').style.display = 'block'
    document.getElementById('settings').style.display = 'none'
    document.getElementById('profile').style.display = 'none'
    document.getElementById('dashboard').style.display = 'none'
    getUsers()
}

function openSettings() {
    document.getElementById('users').style.display = 'none'
    document.getElementById('settings').style.display = 'flex'
    document.getElementById('profile').style.display = 'none'
    document.getElementById('dashboard').style.display = 'none'
    getServices()
}

function popupuserwindow(){
    document.getElementById('addnewuser').style.display='block'
}

function popupservicewindow(){
    document.getElementById('addnewservice').style.display='block'
}

function closepopup(){
    document.getElementById('addnewuser').style.display='none'
    document.getElementById('addnewservice').style.display='none'
}

function openProfile() {
    document.getElementById('users').style.display = 'none'
    document.getElementById('settings').style.display = 'none'
    document.getElementById('profile').style.display = 'block'
    document.getElementById('dashboard').style.display = 'none'
    getMyProfile()
}

function getDashboardData() {
    $.ajax({
        url: '/reports/getDashboardData',
        type: 'Get',
        success: function (data) {
            document.getElementById('canAptcount').innerHTML = data.cancelledApt
            document.getElementById('canPathcount').innerHTML = data.cancelledPath
            document.getElementById('pathcount').innerHTML = data.pathBills
            document.getElementById('aptcount').innerHTML = data.appointments
        },
        error: function (err) {

        }
    })
}

function getUsers() {
    $.ajax({
        url: '/user/getAllUsers',
        type: 'Get',
        success: function (data) {
            let container = document.getElementById('usersListTable');
            container.innerHTML = ``;
            for (let i = 0; i < data.usersList.length; i++) {
                let user = data.usersList[i]
                let rowItem = document.createElement('tr');
                if (user.isValid == true) {
                    rowItem.innerHTML =
                        `
                    <td>${user.email}</td>
                    <td>${user.Name}</td>
                    <td>${user.Role}</td>
                    <td>
                        <div class="form-check form-switch">
                        <input style='margin-left:0%' class="form-check-input" type="checkbox" onchange="enableDisableUser('${user._id}')" role="switch" id="checkbox_${user._id}" checked>
                        </div>
                    </td>
                    <td>Reset password</td>
                `
                } else {
                    rowItem.innerHTML =
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
        error: function (err) {
            console.log(err)
        }
    })
}


function getServices() {
    $.ajax({
        url: '/reports/getAllServices',
        type: 'GET',
        success: function (data) {
            let container = document.getElementById('services-list');
            container.innerHTML = ``;
            for (let i = 0; i < data.services.length; i++) {
                let service = data.services[i];
                let rowItem = document.createElement('tr');
                rowItem.id = service._id
                rowItem.innerHTML =
                    `
                    <td>${i+1}</td>
                        <th>${service.Name}</th>
                        <td><b>₹ ${service.Price}</b></td>
                        <td>${service.Category}</td>
                        <td>${service.Notes}</td>
                        <td>${service.RefRangeMin}</td>
                        <td>${service.RefRangeMax}</td>
                        <td>${service.RefRangeUnit}</td>
                        <td>
							<div style="margin-left:1%" onclick = "deleteService('${service._id}')" >
								<span id="dustbinLight" onmouseover = "highlight()" onmouseout = "unhighlight()" ><i class="fa-solid fa-trash-can"></i></span>
								<span style="display:none;" id="dustbinDark" onmouseover = "highlight()" onmouseout = "unhighlight()" ><i class="fa-regular fa-trash-can"></i></span>
							</div>
						</td>
                    `
                container.appendChild(rowItem)
            }
        },
        error: function (req, res) {
            console.log(err)
        }
    })

}

function deleteService(id){
    let confirmation = window.confirm("Service will be deleted permanently, Please CConfirm !!!")
    if(confirmation){
        $.ajax({
            url:'/reports/deleteService/'+id,
            type:'Delete',
            success:function(data){
                document.getElementById(id).remove();
            },
            error:function(err){}
        })
    }else{
        return
    }
    
}

function unhighlight(x) {
    document.getElementById('dustbinDark').style.display = "none";
    document.getElementById('dustbinLight').style.display = "block";
}

function highlight(x) {
    document.getElementById('dustbinDark').style.display = "block";
    document.getElementById('dustbinLight').style.display = "none";
}

let valuesToUpdate = new Array();

function markToUpdate(id) {
    let item = {
        id: id,
        Price: document.getElementById(id + 'price').value.split('₹')[1]
    }
    valuesToUpdate.push(item);
}

function saveSettings() {
    $.ajax({
        url: '/reports/saveServiceSettings',
        data: {
            valuesToUpdate,
        },
        type: 'POST',
        success: function (data) {
            new Noty({
                theme: 'relax',
                text: 'Settings saved',
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
            return
        },
        error: function (err) {
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


function AddNewService() {
    let Name = document.getElementById('serviceName').value
    let Category = document.getElementById('serviceCategory').value
    let Price = document.getElementById('servicePrice').value
    let Notes = document.getElementById('serviceNotes').value
    let RefRangeMin = document.getElementById('rrmin').value
    let RefRangeMax = document.getElementById('rrmax').value
    let RefRangeUnit = document.getElementById('rrunit').value
    let Type = document.getElementById('serviceType').value
    $.ajax({
        url: '/reports/saveService',
        data: {
            Name,
            Category,
            Price,
            RefRangeMin,
            RefRangeMax,
            RefRangeUnit,
            Notes,
            Type
        },
        type: 'POST',
        success: function (data) {
            new Noty({
                theme: 'relax',
                text: 'Service saved',
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();

            document.getElementById('serviceName').value = ''
            document.getElementById('serviceCategory').value = ''
            document.getElementById('servicePrice').value = ''
            document.getElementById('serviceNotes').value = ''
            document.getElementById('rrmin').value = ''
            document.getElementById('rrmax').value = ''
            document.getElementById('rrunit').value = ''
            document.getElementById('serviceType').value = ''
            closepopup()
            return
        },
        error: function (err) {
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

function enableDisableUser(user) {
    let message = '';
    let status = document.getElementById('checkbox_' + user).checked
    if (status) {
        message = 'User enabled'
    } else {
        message = 'User disabled'
    }
    $.ajax({
        url: '/user/changeStatus',
        data: {
            user,
            status
        },
        type: 'Post',
        success: function (data) {
            new Noty({
                theme: 'relax',
                text: message,
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
        },
        error: function (err) {
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


function getMyProfile() {
    $.ajax({
        url: '/user/profile',
        success: function (data) {
            document.getElementById('profileName').value = data.user.Name
            document.getElementById('profileMobile').value = data.user.Mobile
            document.getElementById('profileUsername').value = data.user.email
            document.getElementById('profileRole').value = data.user.Role
        },
        error: function (err) {}
    })
}



function updateProfile() {
    let Name = document.getElementById('profileName').value
    let Mobile = document.getElementById('profileMobile').value
    let email = document.getElementById('profileUsername').value
    if (Name == '' || Mobile == '' || email == '') {
        new Noty({
            theme: 'relax',
            text: 'Empty values not allowed',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    $.ajax({
        url: '/user/updateProfile',
        type: 'POST',
        data: {
            Name,
            Mobile,
            email
        },
        success: function (data) {
            new Noty({
                theme: 'relax',
                text: 'Profile updated',
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
            return
        },
        error: function (err) {
            new Noty({
                theme: 'relax',
                text: JSON.parse(err.responseText)['message'],
                type: 'error',
                layout: 'topRight',
                timeout: 1500
            }).show();
            return
        }
    })
}


function AddNewUser(){
    let feilds = ['FullName', 'Mobile', 'email', 'Password', 'Role']
    let profileData = new Object();
    for(let i=0;i<feilds.length;i++){
        if(document.getElementById(feilds[i]).value == ''){
            new Noty({
                theme: 'relax',
                text: 'All feilds are mandatory',
                type: 'error',
                layout: 'topRight',
                timeout: 1500
            }).show();
            return
        }else{
            profileData[feilds[i]] = document.getElementById(feilds[i]).value
        }
    }
    $.ajax({
        url:'/user/addNew',
        data:profileData,
        type:'Post',
        success:function(data){
            new Noty({
                theme: 'relax',
                text: 'User added',
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
        },
        error: function(err){
            new Noty({
                theme: 'relax',
                text: 'Unable to add user',
                type: 'error',
                layout: 'topRight',
                timeout: 1500
            }).show();
        },
    })
}