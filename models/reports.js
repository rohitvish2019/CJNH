const mongoose = require('mongoose');
const Patient = require('./patients');
const Reports = new mongoose.Schema({
    ReportNo:String,
    Patient:mongoose.Schema.Types.ObjectId,
    Doctor:String,
    Name:String,
    Age:String,
    Address:String,
    Mobile:String,
    Date:String,
    Gender:String,
    User:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    Username:String,
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