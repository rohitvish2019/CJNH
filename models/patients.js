const mongoose = require('mongoose');
const Patients = new mongoose.Schema({
    Name:String,
    Age:Number,
    Address:String,
    IPDNumber :String,
    Mobile:String,
    Id:Number,
    Doctor:String,
    Husband:String,
    IdProof:String,
    Gender:{
        type:String,
        enum:['Male','Female','Other']
    },
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
    
    AdvancePaymentBills:[
        {
            type: Array,
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