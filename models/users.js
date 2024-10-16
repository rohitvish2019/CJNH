const mongoose = require('mongoose');
const Users = new mongoose.Schema({
    email:String,
    password:String,
    Role:String,
    Name:String,
    Mobile:String,
    Address:String,
    Age:Number,
    isAdmin:{
        type:String,
        default:false
    },
    isCancelled:{
        type:Boolean,
        default:false
    },
    isValid:{
        type:Boolean,
        default:true
    }
},
{
    timestamps:true
});

const User = mongoose.model('User', Users);
module.exports = User;