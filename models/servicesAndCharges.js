const mongoose = require('mongoose');
const Services = new mongoose.Schema({
    Name:String,
    Price:Number,
    RefRangeMin:Number,
    RefRangeMax:Number,
    RefRangeUnit:String,
    Category:String,
    Type:String,
    PaidTo:String,
    Notes:String
},
{
    timestamps:true
});

const Service = mongoose.model('Service', Services);
module.exports = Service;