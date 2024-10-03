const mongoose = require('mongoose');
const Bills = new mongoose.Schema({
    Type:String,
    Total:Number,
    Items:[
        {
            type:String
        }
    ],
    Name:String,
    Age:Number,
    Address:String,
    Mobile:String,
    Patient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Patient'
    },
    User:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    UserName:String,
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