const mongoose = require('mongoose');
const Medicine = new mongoose.Schema({
    Name:String,
    Dosage:String,
    Duration:String,
},
{
    timestamps:true
});

const Meds = mongoose.model('Medicine', Medicine);
module.exports = Meds;