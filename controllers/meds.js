const MedsData = require('../models/meds')
module.exports.addMeds = async function(req, res){
    try{
        await MedsData.create({
            Name:req.body.Name,
            Composition:req.body.Composition,
            Dosage:req.body.Dosage,
            Duration:req.body.Duration,
            Type:req.body.Type,
            Category:req.body.Category
        });
        return res.status(200).json({
            message:'Medicine record created'
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Unable to add Medicine'
        })
    }
}

module.exports.getAllMedicine = async function(req, res){
    try{
        let medsList = await MedsData.find({});
        return res.status(200).json({
            medsList,
            message:'Medicine fetched'
        })
    }catch(err){
        return res.status(500).json({
            message:'Unable to find Medicine List'
        })
    }
}

module.exports.deleteMedicine = async function(req, res){
    try{
        await MedsData.deleteOne({_id:req.params.medId})
        return res.status(200).json({
            message:'Nedicine Deleted'
        })
    }
    catch(err){
        return res.status(500).json({
            message:'Unable to Delete Medicine'
        })
    }
}