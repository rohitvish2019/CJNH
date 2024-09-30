const mongoose = require('mongoose');
const Doctors = new mongoose.Schema({
    Name:String,
    Age:Number,
    Address:String,
    Mobile:String,
    Id:Number,
    VisitFees:Number,
    earlyVisitFees:Number,
    isValid:{
        type:Boolean,
        default:true
    },
    isCancelled:{
        type:Boolean,
        default:false
    }
},
{
    timestamps:true
});

const Doctor = mongoose.model('Doctor', Doctors);
module.exports = Doctor;