const mongoose = require('mongoose');
const AdmittedPatients = new mongoose.Schema({
    OPDID : {
        type: Number,
    },
    AdmissionNo:String,
    Name:{
        type:String
    },
    Mobile :{
        type: String
    },
    Gender:{
        type:String,
    },
    Age: {
        type: Number,
    },
    Address: {
        type:String
    },
    BroughtBy:{
        type:String
    },
    AdmissionDate:{
        type:Date
    },
    AdmissionTime:String,
    OperationDate:{
        type:Date
    },
    DischargeDate:{
        type:Date
    },

    DischargeTime:String,
    Investigation:Array,
    TreatmentInAdmission:Array,
    OperativeNotes:String,
    BabyNotes:String,
    OH:Array,
    DischargePrescription:Array,
    DischargeAdvice:String,
    isDischarged:{
        type:Boolean,
        default:false
    },
    Reason:{
        type:String
    },
    Doctor:{
        type:String
    },
    isValid:Boolean
},
{
    timestamps:true
});

const admittedPatients = mongoose.model('AdmittedPatients', AdmittedPatients);
module.exports = admittedPatients;