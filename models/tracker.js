const mongoose = require('mongoose');
const Trackers = new mongoose.Schema({
    patientId:Number,
    ReportNo:Number
},
{
    timestamps:true
});

const Tracker = mongoose.model('Tracker', Trackers);
module.exports = Tracker;