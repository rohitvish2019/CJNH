const mongoose = require('mongoose');
const Patients = new mongoose.Schema({
    Name:String,
    Price:Number,
    Quantity:Number,
    Bought_Date:String,
    isValid:{
        type:Boolean,
        default:true
    },
    isCancelled:{
        type:Boolean,
        default:false
    },
},
{
    timestamps:true
});

const Patient = mongoose.model('Patient', Patients);
module.exports = Patient;