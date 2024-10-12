const mongoose = require('mongoose');
const Trackers = new mongoose.Schema({
    patientId:Number,
    ReportNo:Number,
    PathologyBillNo:Number,
    AppointmentNumber:Number
},
{
    timestamps:true
});

const Tracker = mongoose.model('Tracker', Trackers);
module.exports = Tracker;