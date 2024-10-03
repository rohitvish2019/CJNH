const PatientData = require('../models/patients');
const ReportsData = require('../models/reports');
const Tracker = require('../models/tracker');
const Tracker = require('../models/tracker')
module.exports.saveReport = async function(req, res){
    //Items will be an array of string where each element will be in below format
    //Itemname$price$category$result
    try{
        let patient=null
        let Name, Age, Address, Mobile, Id;
        if(req.body.id){
            patient = await PatientData.findById(req.body.id);
            if(!patient || patient == null){
                return res.status(400).json({
                    message:'Invalid Patient'
                })
            }
            Name = patient.Name
            Age = patient.Age
            Address = patient.Address
            Mobile = patient.Mobile
            Id = patient._id
        }else{
            Name = req.body.Name
            Age = req.body.Age
            Address = req.body.Address
            Mobile = req.body.Mobile
            Id = null
        }
        let tracker = await Tracker.findOne({});
        let newReportNo = +tracker.ReportNo + 1
        let report = await ReportsData.create({
            Patient:Id,
            Name:Name,
            Age:Age,
            Address:Address,
            Mobile:Mobile,
            ReportNo:newReportNo,
            Items: req.body.Items,
            Doctor:req.body.Doctor,
            User:req.user._id,
            Username:req.user.Name
        });
        await tracker.updateOne({ReportNo:newReportNo});
        return res.status(200).json({
            message:'Report saved',
            report_id : report._id
        })

    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Internal Server Error : Unable to save report',
        })
    }
}


module.exports.cancelSale = async function(req,res){
    try{
        let report = await ReportsData.findByIdAndUpdate(req.body.id, {$set:{isCancelled:true}});
        if(report){
            return res.status(200).json({
                message:'Report cancelled'
            })
        }else{
            return res.status(404).json({
                message:'No report found'
            })
        }
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Internal Server Error : Unable to cancel report'
        })
    }
}

module.exports.getReportById = async function(req, res){
    let report 
    try{
        report = await ReportsData.findById(req.body.id);
        if(report){
            return res.status(200).json({
                message:'Report fetched successfully',
                report,
            })
        }else{
            return res.status(404).json({
                message:'No report found by id',
                report,
            })
        } 
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Internal Server Error : Unable to fetch report',
        })
    }
}

module.exports.getAllReportsByPatient = async function(req, res){
    try{
        let reports = await ReportsData.find({Patient:req.body.PatientId});
        if(reports.length > 0){
            return res.status(200).json({
                message:reports.length +' reports fetched',
                reports
            })
        }else{
            return res.status(404).json({
                message:'No reports found for the patient'
            })
        }
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Internal Server Error : Unable to find bill by patient id'
        })
    }
}