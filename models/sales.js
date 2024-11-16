const mongoose = require('mongoose');
const Sales = new mongoose.Schema({
    Patient:mongoose.Schema.Types.ObjectId,
    Name:String,
    Age:Number,
    Address:String,
    Mobile:String,
    Items:Array,
    Gender:String,
    PatiendID:String,
    Doctor:String,
    type:String,
    ReportNo:String,
    Total:Number,
    PaymentType:String,
    BillDate:{
        type:String,
        default:new Date().toISOString().split('T')[0]
    },
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

const Sale = mongoose.model('Sale', Sales);
module.exports = Sale;