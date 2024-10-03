const mongoose = require('mongoose');
const Patients = new mongoose.Schema({
    Name:String,
    Age:Number,
    Address:String,
    Mobile:String,
    Id:Number,
    Doctor:String,
    isValid:{
        type:Boolean,
        default:true
    },
    isCancelled:{
        type:Boolean,
        default:false
    }, 
    Visits:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Visit'
        }
    ],
    
    Bills:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Bill'
        }
    ],
    Reports:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Report'
        }
    ]
},
{
    timestamps:true
});

const Patient = mongoose.model('Patient', Patients);
module.exports = Patient;