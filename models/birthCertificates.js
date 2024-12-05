const mongoose = require('mongoose');
const Certificate = new mongoose.Schema({
    CertificateNumber:String,
    OPDId:Number,
    IPDId:Number,
    Patient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Patient'
    },
    Visit:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Visit'
    },
    Name:String,
    Husband:String,
    Age:String,
    Village:String,
    Tahsil:String,
    District:String,
    State:String,
    DeliveryType:String,
    Gender:String,
    BirthTime:String,
    BirthDate:String,
    ChildWeight:String,
    GeneratedOn:String,
    isValid:{
        type:Boolean,
        default:true
    },
    isCancelled :{
        type:Boolean,
        default:false
    },
    User:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    UserName:String,
    
},
{
    timestamps:true
});

const BirthCertificate = mongoose.model('Certificate', Certificate);
module.exports = BirthCertificate;