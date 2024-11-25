const mongoose = require('mongoose');
const Medicine = new mongoose.Schema({
    Name:String,
    Composition:String,
    Dosage:String,
    Duration:String,
    Type:String,
},
{
    timestamps:true
});

const Meds = mongoose.model('Medicine', Medicine);
module.exports = Meds;