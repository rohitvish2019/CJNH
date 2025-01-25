const mongoose = require('mongoose');
const Purchases = new mongoose.Schema({
    Name:String,
    Price:Number,
    Quantity:Number,
    Bought_Date:String,
    ExpiryDate:Date,
    Batch:String,
    Seller:String,
    Category:String,
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

const Purchase = mongoose.model('Purchase', Purchases);
module.exports = Purchase;