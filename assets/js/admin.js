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
    document.getElementById('Medicine').style.display = 'none'
    getDashboardData()
}

function openUsers() {
    document.getElementById('users').style.display = 'block'
    document.getElementById('settings').style.display = 'none'
    document.getElementById('profile').style.display = 'none'
    document.getElementById('dashboard').style.display = 'none'
    document.getElementById('Medicine').style.display = 'none'
    getUsers()
}

function openSettings() {
    document.getElementById('users').style.display = 'none'
    document.getElementById('settings').style.display = 'flex'
    document.getElementById('profile').style.display = 'none'
    document.getElementById('dashboard').style.display = 'none'
    document.getElementById('Medicine').style.display = 'none'
    getServices()
}

function openProfile() {
    document.getElementById('users').style.display = 'none'
    document.getElementById('settings').style.display = 'none'
    document.getElementById('profile').style.display = 'block'
    document.getElementById('dashboard').style.display = 'none'
    document.getElementById('Medicine').style.display = 'none'
    getMyProfile()
}

function openMedicine() {
    document.getElementById('users').style.display = 'none'
    document.getElementById('settings').style.display = 'none'
    document.getElementById('profile').style.display = 'none'
    document.getElementById('dashboard').style.display = 'none'
    document.getElementById('Medicine').style.display = 'block'
    getMedicineData()
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
                    <td style="text-align:center">${user.email}</td>
                    <td style="text-align:center">${user.Name}</td>
                    <td style="text-align:center">${user.Role}</td>
                    <td style="text-align:center">
                        <div class="form-check form-switch">
                        <input style="display:inline" style='margin-left:0%' class="form-check-input" type="checkbox" onchange="enableDisableUser('${user._id}')" role="switch" id="checkbox_${user._id}" checked>
                        </div>
                    </td>
                    <td style="text-align:center">Reset password</td>
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
                    <td style="text-align:center">${i+1}</td>
                        <th>${service.Name}</th>
                        <td style="width:6.5%"><b>₹</b> ${service.Price == undefined ? '' : service.Price}</td>
                        <td style="text-align:center">${service.Category == undefined ? '' : service.Category}</td>
                        <td style="text-align:center">${service.Type == undefined ? '' : service.Type}</td>
                        <td style="text-align:center">${service.Notes == undefined ? '' : service.Notes}</td>
                        <td style="text-align:center">${service.RefRangeMin == undefined ? '' : service.RefRangeMin}</td>
                        <td style="text-align:center">${service.RefRangeMax == undefined ? '' : service.RefRangeMax}</td>
                        <td style="text-align:center">${service.RefRangeUnit == undefined ? '' : service.RefRangeUnit}</td>
                        <td style="text-align:center">
							<div onclick = "deleteService('${service._id}')" >
								<label id="dustbinLight${service._id}" onmouseover = "highlight('${service._id}')" onmouseout = "unhighlight('${service._id}')" ><i class="fa-solid fa-trash-can"></i></label>
								<label style="display:none;" id="dustbinDark${service._id}" onmouseover = "highlight('${service._id}')" onmouseout = "unhighlight('${service._id}')" ><i class="fa-regular fa-trash-can"></i></label>
                                
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

function popupuserwindow() {
    document.getElementById('addnewuser').style.display = 'block'
}

function popupservicewindow() {
    document.getElementById('addnewservice').style.display = 'block'
}

function popupmedicinewindow(){
    document.getElementById('addnewmedicine').style.display = 'block'
}

function closepopup() {
    document.getElementById('addnewuser').style.display = 'none'
    document.getElementById('addnewservice').style.display = 'none'
    document.getElementById('addnewmedicine').style.display = 'none'
}

function highlight(x) {
    document.getElementById('dustbinDark' + x).style.display = "block";
    document.getElementById('dustbinLight' + x).style.display = "none";
}

function unhighlight(x) {
    document.getElementById('dustbinDark' + x).style.display = "none";
    document.getElementById('dustbinLight' + x).style.display = "block";
}



function deleteService(id) {
    let confirmation = window.confirm("Service will be deleted permanently, Please CConfirm !!!")
    if (confirmation) {
        $.ajax({
            url: '/reports/deleteService/' + id,
            type: 'Delete',
            success: function (data) {
                document.getElementById(id).remove();
            },
            error: function (err) {}
        })
    } else {
        return
    }

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
            getServices()
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
    console.log(user);
    console.log(document.getElementById('checkbox_' + '670ec783ffc1d1b458e96db7'))
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
            document.getElementById('checkbox_' + user).checked = 'true'
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

function getMedicineData(){
    $.ajax({
        url:'/meds/getAll',
        type:'GET',
        success:function(data){
            console.log(data.medsList);
            let container = document.getElementById('MedicineListTable');
            container.innerHTML=``;
            for(let i=0;i<data.medsList.length;i++){
                let item = document.createElement('tr');
                item.innerHTML=
                `
                    <tr id="data.medsList[i]._id">
                        <td>${data.medsList[i].Name}</td>
                        <td>${data.medsList[i].Dosage}</td>
                        <td>${data.medsList[i].Duration}</td>
                    </tr>
                `
                container.appendChild(item)
            }
        },
        error:function(err){}
    })
}


function AddNewMedicine(){
    console.log('Adding meds')
    let Name = document.getElementById('MedicineName').value;
    let Dosage = document.getElementById('Dosage').value;
    let Duration = document.getElementById('Duration').value;
    if(!Name || Name == ''){
        new Noty({
            theme: 'relax',
            text: 'Medicine Name is mandatory',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    if(!Dosage || Dosage == ''){
        new Noty({
            theme: 'relax',
            text: 'Medicine dosage is mandatory',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }

    $.ajax({
        url:'/meds/addNew',
        data:{
            Name, Dosage, Duration,
        },
        type:'POST',
        success:function(data){
            closepopup()
            getMedicineData()
            new Noty({
                theme: 'relax',
                text: 'Meds record added',
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
            return
        },
        error:function(data){
            new Noty({
                theme: 'relax',
                text: 'Unable to add medicine',
                type: 'error',
                layout: 'topRight',
                timeout: 1500
            }).show();
            return
        },
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


function AddNewUser() {
    let feilds = ['FullName', 'Mobile', 'email', 'Password', 'Role']
    let profileData = new Object();
    for (let i = 0; i < feilds.length; i++) {
        if (document.getElementById(feilds[i]).value == '') {
            new Noty({
                theme: 'relax',
                text: 'All feilds are mandatory',
                type: 'error',
                layout: 'topRight',
                timeout: 1500
            }).show();
            return
        } else {
            profileData[feilds[i]] = document.getElementById(feilds[i]).value
        }
    }
    $.ajax({
        url: '/user/addNew',
        data: profileData,
        type: 'Post',
        success: function (data) {
            new Noty({
                theme: 'relax',
                text: 'User added',
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
            closepopup();
            getUsers()
        },
        error: function (err) {
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