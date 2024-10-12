const Users = require("../models/users")

module.exports.addUser = async function(req, res){
    try{
        let user;
        user = await Users.findOne({email:req.user.email});
        if(user){
            return res.status(409).json({
                message:'User id already exists'
            })
        }else{
            await Users.create({
                Name:req.body.Name,
                Address:req.body.Address,
                Mobile:req.body.Mobile,
                email:req.body.email,
                password:req.body.password,
                role:req.body.role,
            })
        }
        return res.status(200).json({
            message:'User created',
        })
    }catch(err){
        return res.status(500).json({
            message:'Internal Server Error : Unable to create user'
        })
    }
}

module.exports.makeUserInvalid = async function(req, res){
    try{
        let user = await Users.findByIdAndUpdate(req.body.id,{isCancelled:true, isValid:false});
        if(user){
            return res.status(200).json({
                message:'User disabled'
            })
        }else{
            return res.status(404).json({
                message:'Unable to find user'
            })
        }
    }catch(err){
        return res.status(500).json({
            message:'Internal Server Error : Disable user failed'
        })
    }
}

module.exports.reEnableUser = async function(req, res){
    try{
        let user = await Users.findByIdAndUpdate(req.body.id,{isCancelled:false, isValid:true});
        if(user){
            return res.status(200).json({
                message:'User enabled'
            })
        }else{
            return res.status(404).json({
                message:'Unable to find user'
            })
        }
    }catch(err){
        return res.status(500).json({
            message:'Internal Server Error : Enable user failed'
        })
    }
}

module.exports.updateMyPassword = async function(req, res){
    try{
        let user = await Users.findOne({email:req.user.email});
        if(user && user.password == req.body.oldPassword){
            await user.updateOne({password:req.body.newPassword})
            return res.status(200).json({
                message:'Password updated'
            })
        }else{
            return res.status(404).json({
                message:'Unable to find user or invalid password'
            })
        }
    }catch(err){
        return res.status(500).json({
            message:'Internal Server Error : Password update failed'
        })
    }
}

module.exports.updateProfile = async function(req, res){
    try{
        let user = await Users.findByIdAndUpdate(req.body.id,{
            Name:req.body.Name,
            Address:req.body.Address,
            Mobile:req.body.Mobile
        });
        if(user){
            return res.status(200).json({
                message:"User profile updated"
            })
        }else{
            return res.status(404).json({
                message:'No user found'
            })
        }
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Internal Server Error : Unable to update user profile'
        })
    }
}