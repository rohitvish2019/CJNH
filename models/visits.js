const mongoose = require('mongoose');
const Patient = require('./patients');
const Visits = new mongoose.Schema({
    Patient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Patient'
    },
    Type:String,
    Outside_docs:String,
    Visit_date:String,
    Prescriptions:Array,
    Fees:Number,
    isOpened:{default:false,type:Boolean},
    Doctor:String,
    AdmissionDate:String,
    DischargeDate:String,
    BroughtBy:String,
    Reason:String,
    AdmissionTime:String,
    DischargeTime:String,
    isDischarged:Boolean,
    RoomType:String,
    VisitData:Object,
    DischargeData:Object,
    prescribedMeds:Array,
    advancedPayments:Array,
    PaymentType:String,
    weight:Number,
    PathReports:Array,
    DeliveryType:String,
    DischargeBillNumber:String,
    FinalBillAmount:Number,
    OtherDocs:[
        {
            type:Array
        }
    ],
    SaleId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Sale'
    },
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