const mongoose = require('mongoose');
const Uploads = new mongoose.Schema({
    Filename:String,
    Timestamp:String,
    Patient:mongoose.Schema.Types.ObjectId,
    Visit:mongoose.Schema.Types.ObjectId,
    Date:String,
},
{
    timestamps:true
});

const Upload = mongoose.model('Uploads', Uploads);
module.exports = Upload;