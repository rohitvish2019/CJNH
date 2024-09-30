const mongoose = require('mongoose');
const Patient = require('./patients');
const Visits = new mongoose.Schema({
    Patient:mongoose.Schema.Types.ObjectId,
    Type:String,
    Outside_docs:String,
    Visit_date:String,
    Prescriptions:Array,
    Fees:Number,
    Doctor:String,
    isValid:{
        type:Boolean,
        default:true
    },
    isCancelled:{
        type:Boolean,
        default:false
    },
    Used_inventories:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Inventory'
        }
    ],
    Used_inventories_quantity:[
        {
            type:Number
        }
    ]
},
{
    timestamps:true
});

const Visit = mongoose.model('Visit', Visits);
module.exports = Visit;