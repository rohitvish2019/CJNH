const mongoose = require('mongoose');
const Patient = require('./patients');
const Reports = new mongoose.Schema({
    Patient:mongoose.Schema.Types.ObjectId,
    Doctor:String,
    isValid:{
        type:Boolean,
        default:true
    },
    isCancelled:{
        type:Boolean,
        default:false
    },
    Items:[
        {
            type:String
        }
    ]
},
{
    timestamps:true
});

const Report = mongoose.model('Report', Reports);
module.exports = Report;