const multer  = require('multer')
//const upload = multer({ dest: 'uploads/' })
const Uploads = require('../models/uploads');
const VisitData = require('../models/visits');
module.exports.uploadTest = async function(req, res){
    console.log("Printing incontroller")
    console.log(req.body)
    try{
        let visit = await VisitData.findById(req.body.visitId);
        let date = new Date().toLocaleDateString().split("/").join("_")
        let link = "/uploads/"+date+"/"+req.body.timeStamp+'_'+req.body.fileName+'.pdf'
        visit.OtherDocs.push(link);
        visit.save();
        return res.status(200).json({
            message:'File uploaded'
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:'Unable to upload'
        })
    }
}