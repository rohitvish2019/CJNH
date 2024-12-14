const mongoose = require('mongoose');
const Trackers = new mongoose.Schema({
    patientId:Number,
    ReportNo:Number,
    PathologyBillNo:Number,
    AppointmentNumber:Number,
    AdmissionNo:Number,
    BirthCertificateNumber:Number,
    USGBillNumber:Number,
    OtherBillNumber:Number,
    AdvancePaymentNumber:Number,
    IPDNumber:Number,
    RecieptNo:Number,
    YearlyIPDCounter:Number,
    MonthlyIPDCounter:Number,
},
{
    timestamps:true
});

const Tracker = mongoose.model('Tracker', Trackers);
module.exports = Tracker;