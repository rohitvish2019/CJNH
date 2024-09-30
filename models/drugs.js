const mongoose = require('mongoose');
const Drugs = new mongoose.Schema({
    DrugId:Number,
    DrugName:String,
    Instructions:String,
    Duration:String,
    Notes:String,
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

const Drug = mongoose.model('Drug', Drugs);
module.exports = Drug;