const PatientData = require('../models/patients');
const ReportsData = require('../models/reports');
const Tracker = require('../models/tracker');
const ServicesData = require('../models/servicesAndCharges')

module.exports.PathalogyHome = async function(req, res){
    try{
        let patient = await PatientData.findById(req.params.id);
        let services = await ServicesData.find({});
        return res.render('pathalogyHome', {patient, services})
    }catch(err){
        console.log(err);
        return res.render('Error_500')
    }
}

module.exports.PathalogyHomeEmpty = async function(req, res){
    try{
        let services = await ServicesData.find({});
        return res.render('pathalogyHomeEmpty', {services})
    }catch(err){
        console.log(err);
        return res.render('Error_500')
    }
}
module.exports.addServicesData = async function(req, res){
    try{
        let service = await ServicesData.create({
            Name:req.body.testname,
            Price:req.body.price,
            Category:req.body.category,
            RefRange:req.body.refRange,

        })
        return res.status(200).json({
            message:'Test added successfully'
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Internal Server Error : Unable to add in tests'
        })
    }
}
module.exports.saveReport = async function(req, res){
    //Items will be an array of string where each element will be in below format
    //Itemname$price$category$result
    try{
        let patient=null
        let Name, Age, Address, Mobile, Id, Gender;
        if(req.body.id){
            patient = await PatientData.findOne({Id:req.body.id});
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
            Gender = patient.Gender
        }else{
            Name = req.body.patient.Name
            Age = req.body.patient.Age
            Address = req.body.patient.Address
            Mobile = req.body.patient.Mobile,
            Gender = Gender
            Id = null
        }
        let tracker = await Tracker.findOne({});
        let newReportNo = +tracker.ReportNo + 1
        let report = await ReportsData.create({
            Patient:Id,
            Name:Name,
            Age:Age,
            Gender:Gender,
            Address:Address,
            Mobile:Mobile,
            ReportNo:newReportNo,
            Items: req.body.tests,
            Doctor:req.body.patient.Doctor,
            Date:new Date().toISOString().split('T')[0]
            //User:req.user._id,   Need to save this id after login setup
            //Username:req.user.Name   Need to save this id after login setup
        });
        
        await tracker.updateOne({ReportNo:newReportNo});
        if(patient){
            patient.Reports.push(report._id);
            await patient.save()
        }
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


module.exports.cancelReport = async function(req,res){
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

/*
Unused function need to delete before go live

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
*/

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

module.exports.viewReport = async function(req, res){
    try{
        let report = await ReportsData.findById(req.params.pid);
        return res.render('pathalogyReportTemplate', {report});
    }catch(err){
        console.log(err);
        return res.render('Error_500')
    }
}

module.exports.pathologyHistoryHome = function(req, res){
    try{
        return res.render('pathReportsHistory')
    }catch(err){
        return res.render('Error_500')
    }
}

module.exports.getHistoryByRange = async function(req, res){
    try{
        let reportsList = await ReportsData.find({
            $and: [
                {createdAt:{$gte :new Date(req.query.startDate)}},
                {createdAt: {$lte : new Date(req.query.endDate)}},
            ]
        }).populate('Patient').sort("createdAt");
        if(reportsList.length > 0){
            return res.status(200).json({
                message:reportsList.length+' reports found',
                reportsList
            })
        }else{
            return res.status(404).json({
                message:'No reports found'
            })
        }
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:'Internal Server Error : Unable to find receipts'
        })
    }
}

module.exports.getHistoryByDate = async function(req, res){
    try{
        let reportsList = await ReportsData.find({
            Date:req.query.selectedDate
        }).populate('Patient').sort("createdAt");
        if(reportsList.length > 0){
            return res.status(200).json({
                message:reportsList.length+' reports found',
                reportsList
            })
        }else{
            return res.status(404).json({
                message:'No reports found'
            })
        }
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:'Internal Server Error : Unable to find receipts'
        })
    }
}

module.exports.getAllServices = async function(req, res){
    try{    
        let services = await ServicesData.find({});
        return res.status(200).json({
            services,
        })
    }catch(err){
        return res.status(500).json({
            message:'Internal server error : Unable to find services'
        })
    }
}

module.exports.getServiceByName = async function(req, res){
    try{    
        let service = await ServicesData.findOne({Name:req.query.name});
        return res.status(200).json({
            service,
        })
    }catch(err){
        return res.status(500).json({
            message:'Internal server error : Unable to find services'
        })
    }
}