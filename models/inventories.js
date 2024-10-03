const mongoose = require('mongoose');
const Inventories = new mongoose.Schema({
    Name:String,
    Price:Number,
    AvailableQuantity:Number,
    Expirydate:Date,
    AlertQuantity:{
        type:Number,
        default:10000
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

const Inventory = mongoose.model('Inventory', Inventories);
module.exports = Inventory;