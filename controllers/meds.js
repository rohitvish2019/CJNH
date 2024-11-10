const MedsData = require('../models/meds')
module.exports.addMeds = async function(req, res){
    try{
        await MedsData.create({
            Name:req.body.Name,
            Dosage:req.body.Dosage,
            Duration:req.body.Duration
        });
        return res.status(200).json({
            message:'Medicine record created'
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Unable to add meds'
        })
    }
}

module.exports.getAllMedicine = async function(req, res){
    try{
        let medsList = await MedsData.find({});
        return res.status(200).json({
            medsList,
            message:'Meds fetched'
        })
    }catch(err){
        return res.status(500).json({
            message:'Unable to find meds list'
        })
    }
}