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
        url: '/user/profile',
        success: function (data) {
            document.getElementById('proName').textContent = data.user.Name
            
        },
        error: function (err) {}
    })

    $.ajax({
        url: '/reports/getDashboardData',
        type: 'Get',
        success: function (data) {
            document.getElementById('canAptcount').innerHTML = data.cancelledApt
            //document.getElementById('canPathcount').innerHTML = data.cancelledPath
            document.getElementById('pathcount').innerHTML = data.pathBills
            document.getElementById('aptcount').innerHTML = data.appointments
            document.getElementById('usgcount').innerHTML = data.ultraSoundBill
            
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
                    <td style="text-align:center">${user.email}</td>
                    <td style="text-align:center">${user.Name}</td>
                    <td style="text-align:center">${user.Role}</td>
                    <td style="text-align:center">
                        <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" onchange="enableDisableUser('${user._id}')" role="switch" id="checkbox_${user._id}">
                        </div>
                    </td>
                    <td style="text-align:center">Reset password</td>
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
                        <td style="width:6.5%"><b></b><input id="${service._id}price" type="text" onchange="saveSettings('${service._id}')" value="₹${service.Price}"></td>
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

function popupmedicinewindow() {
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
    let confirmation = window.confirm("Service will be deleted permanently, Please Confirm !")
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
    console.log("Function Call mark to update")
    let item = {
        id: id,
        Price: document.getElementById(id + 'price').value.split('₹')[1]
    }
    valuesToUpdate.push(item);
}

function saveSettings(id) {
    $.ajax({
        url: '/reports/saveServiceSettings',
        data: {
        id: id,
        Price:  document.getElementById(id + 'price').value.toString().indexOf('₹') == -1 ? document.getElementById(id + 'price').value : document.getElementById(id + 'price').value.split('₹')[1]
        },
        type: 'POST',
        success: function (data) {
            new Noty({
                theme: 'relax',
                text: 'Price Updated',
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
        message = 'User Enabled'
    } else {
        message = 'User Disabled'
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

function getMedicineData() {
    $.ajax({
        url: '/meds/getAll',
        type: 'GET',
        success: function (data) {
            console.log(data.medsList);
            let container = document.getElementById('MedicineListTable');
            container.innerHTML = ``;
            for (let i = 0; i < data.medsList.length; i++) {
                let item = document.createElement('tr');
                item.innerHTML =
                    `
                    <tr id="data.medsList[i]._id">
                        <td style="text-align:center; ">${i+1}</td>         
                        <td style="padding-left:10px; font-weight:bold;">${data.medsList[i].Name}</td>
                        <td style="padding-left:10px; ">${data.medsList[i].Composition}</td>
                        <td style="text-align:center">${data.medsList[i].Dosage}</td>
                        <td style="text-align:center">${data.medsList[i].Category}</td>
                        <td style="text-align:center">${data.medsList[i].Duration}</td>
                        <td style="text-align:center">${data.medsList[i].Type == 'DischargeMed' ? "Yes":"No"}</td>
                        <td style="text-align:center">
                            <div onclick = "deleteMedicine('${data.medsList[i]._id}')">
                            <label id="dustbinLight${data.medsList[i]._id}" onmouseover = "highlight('${data.medsList[i]._id}')" onmouseout = "unhighlight('${data.medsList[i]._id}')" ><i class="fa-solid fa-trash-can"></i></label>
							<label style="display:none;" id="dustbinDark${data.medsList[i]._id}" onmouseover = "highlight('${data.medsList[i]._id}')" onmouseout = "unhighlight('${data.medsList[i]._id}')" ><i class="fa-regular fa-trash-can"></i></label>
                            </div>
                        </td>
                    </tr>
                `
                container.appendChild(item)
            }
        },
        error: function (err) {}
    })
}


function AddNewMedicine() {
    console.log('Adding meds')
    let Name = document.getElementById('MedicineName').value;
    let Composition = document.getElementById('Composition').value;
    let Dosage = document.getElementById('Dosage').value;
    let Duration = document.getElementById('Duration').value;
    let Type = document.getElementById('medType').value
    let Category = document.getElementById('Category').value
    
    if (!Name || Name == '') {
        new Noty({
            theme: 'relax',
            text: 'Medicine Name is mandatory',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    if (!Dosage || Dosage == '') {
        new Noty({
            theme: 'relax',
            text: 'Medicine Dosage is mandatory',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }

    $.ajax({
        url: '/meds/addNew',
        data: {
            Name,
            Composition,
            Dosage,
            Duration,
            Type,
            Category
        },
        type: 'POST',
        success: function (data) {
            closepopup()
            getMedicineData()
            new Noty({
                theme: 'relax',
                text: 'New Medicine record saved successfully',
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
            document.getElementById('MedicineName').value = ''
            document.getElementById('Composition').value = ''
            document.getElementById('Dosage').value = ''
            document.getElementById('Duration').value = ''
            document.getElementById('Category').value = ''
            return
        },
        error: function (data) {
            new Noty({
                theme: 'relax',
                text: 'Unable to add Medicine',
                type: 'error',
                layout: 'topRight',
                timeout: 1500
            }).show();
            return
        },
    })

}

function deleteMedicine(id){
    let confirmation = window.confirm("Medicine will be deleted permanently, Please Confirm !")
    if (confirmation) {
        $.ajax({
            url: '/meds/deleteMedicine/' + id,
            type: 'Delete',
            success: function (data) {
                new Noty({
                    theme: 'relax',
                    text: 'Medicine deleted successfully',
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1500
                }).show();
                getMedicineData();
                return
            },
            error: function (err) {
                new Noty({
                    theme: 'relax',
                    text: 'Unable to Delete Medicine',
                    type: 'error',
                    layout: 'topRight',
                    timeout: 1500
                }).show();
            }

        })
    } else {
        return
    }

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
                text: 'Profile Updated',
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
                text: 'All fields are Mandatory',
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
                text: 'New User added successfully',
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