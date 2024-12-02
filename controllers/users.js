const { emit } = require("../models/patients")
const Users = require("../models/users")
module.exports.loginHome = function(req, res){
    if(req.isAuthenticated()){
        if(req.user.Role == 'Admin'){
            return res.redirect('/patients/getAppointments/today')
        }else{
            return res.redirect('/patients/new')
        }
        
    }
    else{
        console.log('Unable to authenticate')
        return res.render('login');
    }
    
}
module.exports.createSession = async function(req, res){
    try{
        if(req.user.Role == 'Admin'){
            return res.redirect('/patients/getAppointments/today')
        }else{
            return res.redirect('/patients/new');
        }
        
    }catch(err){
        console.log(err)
        return res.render('Error_500')
    }
}

module.exports.logout = function(req, res){
    try{
        req.logout(function(err){
            if(err){
                console.log(err)
            return res.redirect('back');
            }
        });
        return res.redirect('/user/login');
    }catch(err){
        console.log(err)
        return res.redirect('back');
    }
}



module.exports.addUser = async function(req, res){
    try{
        if(req.user.Role == 'Admin'){
            let user;
            user = await Users.findOne({email:req.body.email});
            if(user){
                return res.status(409).json({
                    message:'User id already exists'
                })
            }else{
                await Users.create({
                    Name:req.body.FullName,
                    Address:req.body.Address,
                    Mobile:req.body.Mobile,
                    email:req.body.email,
                    password:req.body.Password,
                    Role:req.body.Role,
                })
            }
            return res.status(200).json({
                message:'User created',
            })
        }else{
            return res.status(200).json({
                message:'Unauthorized request'
            })
        }
        
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Internal Server Error : Unable to create user'
        })
    }
}

module.exports.adminHome = async function(req, res){
    try{
        if(req.user.Role == 'Admin'){
            return res.render('Admin',{user:req.user});
        }else{
            return res.render('Error_403')
        }
        
    }catch(err){
        console.log(err)
        return res.render('Error_500')
    }
}

module.exports.getUsers = async function(req, res){
    try{
        if(req.user.Role == 'Admin'){
            let usersList = await Users.find({},'email Name Role isValid Mobile');
            return res.status(200).json({
                usersList
            })
        }else{
            return res.status(403).json({
                message:'Unauthorized request : Please check with Admin'
            })
        }
        
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:'Internal server error : Unable to fetch users list'
        })
    }
}

module.exports.changeUserData = async function(req, res){
    try{
        if(req.body.user == req.user._id){
            return res.status(400).json({
                message:'Self disbale in not allowed'
            })
        }
        if(req.user.Role == 'Admin'){
            await Users.findByIdAndUpdate(req.body.user, {isValid:req.body.status});
            return res.status(200).json({
                message:'User status changed'
            })
        }else{
            return res.status(403).json({
                message:'Unauthorized request : Please check with Admin'
            })
        }
        
    }catch(err){
        return res.status(500).json({
            message :'Unable to change status'
        })
    }
}

module.exports.getProfile = async function(req, res){
    try{
        let user = await Users.findById(req.user, 'Name Mobile email Role')
        return res.status(200).json({
            user
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Internal server error : Unable to fetch user'
        })
    }   
}

module.exports.updateProfile = async function(req, res){
    try{
        if(req.user.Role == 'Admin'){
            if(req.user.email != req.body.email){
                let checkDuplicateEmail = await Users.find({email:req.body.email});
                if(checkDuplicateEmail.length > 0){
                    return res.status(400).json({
                        message:'Duplicate username'
                    })
                }
            }
            await Users.findOneAndUpdate({email:req.user.email},{$set:{Name:req.body.Name, email:req.body.email,Mobile:req.body.Mobile}});
            return res.status(200).json({
                message:'Profile updated'
            })
        }else{
            return res.status(403).json({
                message:'Unauthorized request'
            })
        }
        
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:'Internal server Error : Unable to update profile'
        })
    }
}

module.exports.changePasswordHome = function(req, res){
    try{
        return res.render('changePassword',{user:req.user})
    }catch(err){    
        return res.render('Error_500')
    }
}


module.exports.updatePassword = async function(req, res){
    try{
        let user = await Users.findById(req.user)
        console.log(req.body.oldPassword.toString());
        if(user.password.toString() === req.body.oldPassword.toString()){
            await user.updateOne({password:req.body.password});
            user.save();
            return res.status(200).json({
                message:'Password updated'
            })
        }else{
            return res.status(403).json({
                message:'Incorrect old password'
            })
        }
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Internal server error'
        })
    }
}