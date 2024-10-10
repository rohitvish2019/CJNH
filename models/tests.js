const mongoose = require('mongoose');
const Tests = new mongoose.Schema({
    Name:String,
    Price:Number,
    RefRange:String,
    Category:String
},
{
    timestamps:true
});

const Test = mongoose.model('Test', Tests);
module.exports = Test;