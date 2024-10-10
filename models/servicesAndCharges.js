const mongoose = require('mongoose');
const Services = new mongoose.Schema({
    Name:String,
    Price:Number,
    RefRange:String,
    Category:String,
    Type:String,
    PaidTo:String
},
{
    timestamps:true
});

const Service = mongoose.model('Service', Services);
module.exports = Service;