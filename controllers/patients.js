const PatientData = require('../models/patients');
const VisitData = require('../models/visits');
const Tracker = require('../models/tracker')
module.exports.test= function(req, res){
    return res.render('test');
}


module.exports.patientRegistartionHome = function(req, res){
    try{
        return res.render('patientRegistration')
    }catch(err){
        console.log(err)
        return res.render('Error_500')
    }
}

module.exports.oldAppointmentsHome = function(req, res){
    try{
        return res.render('oldAppointments')
    }catch(err){
        console.log(err)
        return res.render('Error_500')
    }
}
// This methods add a visit for old patient and also creates a patient if its new.
module.exports.addVisitAndPatient = async function(req, res){
    try{
        let patient;
        let tracker;
        let newPatientId = -1 
        if(req.body.id){
            patient = await PatientData.findById(req.body.id);
            console.log(patient)
            if(!patient || patient == null){
                return res.status(400).json({
                    message:'Invalid Patient'
                })
            }
        }else{
            tracker = await Tracker.findOne({});
            newPatientId = tracker.patientId+1
            patient = await PatientData.create({
                Name:req.body.Name,
                Age:req.body.Age,
                Address:req.body.Address,
                Mobile:req.body.Mobile,
                Doctor:req.body.Doctor,
                Id:newPatientId
            });
            await tracker.updateOne({patientId:newPatientId})
        }
        let visit = await VisitData.create({
            Patient:patient._id,
            Type:req.body.Type,
            Fees:req.body.Fees,
            Doctor:req.body.Doctor,
            Visit_date:new Date().toISOString().split('T')[0],
            Outside_docs:req.body.Outside_docs
        });
        
        await patient.updateOne({$push:{Visits:visit._id}});
        return res.status(200).json({
            message:'Patient added'
        })
    }catch(err){
        console.log(err);
        return res.status(200).json({
            message:'Internal Server Error : Add patient or visit failed'
        })
    }
}

module.exports.getAppointmentsToday = async function(req, res){
    try{
        let date = new Date().toISOString().split('T')[0];
        let visits = await VisitData.find({Visit_date:date, isCancelled:false, isValid:true}).populate('Patient');
        return res.render('showAppointments',{visits});
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Internal server error : Unable to find visits for today'
        })
    }
}


module.exports.getAppointmentsByDateRange = async function(req, res){
    try{

        let visits = await VisitData.find({
            $and: [
                {createdAt:{$gte :new Date(req.query.startDate)}},
                {createdAt: {$lte : new Date(req.query.endDate)}},
                {isCancelled:false, isValid:true}
            ]
        }).populate('Patient');
        return res.status(200).json({
            message: visits.length + ' Visits fetched',
            visits
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Internal server error : Unable to find visits for today'
        })
    }
}


module.exports.getAppointmentsByDate = async function(req, res){
    console.log(req.query);
    try{
        //Date formart to be fixed to handle all types of formats
        let date = req.query.date;
        let visits = await VisitData.find({Visit_date:date,isCancelled:false, isValid:true}).populate('Patient');
        return res.status(200).json({
            message: visits.length + ' Visits fetched',
            visits
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Internal server error : Unable to find visits for today'
        })
    }
}
