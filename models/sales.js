const mongoose = require('mongoose');
let day = new Date().getDate().toString().padStart(2,'0')
let month = +new Date().getMonth()
let year = new Date().getFullYear()
let date = year +'-'+ (month+1).toString().padStart(2,'0') +'-'+ day; 
const Sales = new mongoose.Schema({
    Patient:mongoose.Schema.Types.ObjectId,
    Visit: mongoose.Schema.Types.ObjectId,
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
    IdProof:String,
    CashPaid:Number,
    OnlinePaid:Number,
    Husband:String,
    BillDate:{
        type:String,
        default:date,
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