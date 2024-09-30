const mongoose = require('mongoose');
const Bills = new mongoose.Schema({
    Type:String,
    Total:Number,
    Items:[
        {
            type:String
        }
    ],
    Patient:mongoose.Schema.Types.ObjectId,
    User:mongoose.Schema.Types.ObjectId,
    BillDate:String,
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

const Bill = mongoose.model('Bill', Bills);
module.exports = Bill;