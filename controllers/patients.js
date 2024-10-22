const PatientData = require('../models/patients');
const VisitData = require('../models/visits');
const Tracker = require('../models/tracker');
const Sales = require('../models/sales');
const AdmittedPatients = require('../models/admittedPatients')

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
        if(req.user.Role == 'Admin'){
            return res.render('oldAppointments')
        }else{
            return res.render('Error_403')
        }
    }catch(err){
        console.log(err)
        return res.render('Error_500')
    }
}
// This methods add a visit for old patient and also creates a patient if its new.
module.exports.addVisitAndPatient = async function(req, res){
    try{
        let patient;
        let tracker = await Tracker.findOne({});
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
            newPatientId = tracker.patientId+1
            patient = await PatientData.create({
                Name:req.body.Name,
                Age:req.body.Age,
                Address:req.body.Address,
                Mobile:req.body.Mobile,
                Doctor:req.body.Doctor,
                Id:newPatientId,
                Gender:req.body.Gender
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
        let updatedReportNo = +tracker.AppointmentNumber + 1
        await patient.updateOne({$push:{Visits:visit._id}});
        let sale = await Sales.create({
            ReportNo:'APMT'+tracker.AppointmentNumber,
            Name:req.body.Name,
            Age:req.body.Age,
            Address:req.body.Address,
            Mobile:req.body.Mobile,
            Doctor:req.body.Doctor,
            Gender:req.body.Gender,
            PatiendID:newPatientId,
            Items:['Appointment$1$'+req.body.Fees],
            type:'Appointment'

        })
        await visit.updateOne({SaleId:sale._id})
        await tracker.updateOne({AppointmentNumber:updatedReportNo})
        return res.status(200).json({
            message:'Patient added',
            visit:sale._id
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
        let visits;
        console.log(req.query);
        if(req.query.status == 'true'){
            visits = await VisitData.find({Visit_date:date, isCancelled:false}).populate('Patient');
        }else{
            visits = await VisitData.find({Visit_date:date, isCancelled:false, isValid:true}).populate('Patient');
        }
            
        if(req.xhr){
            console.log('Its an xhr request')
            return res.status(200).json({
                visits
            })
        }else{
            return res.render('showAppointments',{visits});
        }
        
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
        let visits;
        if(req.query.status == 'true'){
            visits = await VisitData.find({Visit_date:date,isCancelled:false}).populate('Patient');
        }else{
            visits = await VisitData.find({Visit_date:date,isCancelled:false, isValid:true}).populate('Patient');
        }
        return res.status(200).json({
            message: visits.length + ' Visits fetched',
            visits
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Internal server error : Unable to find visits for specified date'
        })
    }
}


module.exports.getPatientById = async function(req, res){
    try{
        console.log(req.params)
          let patient = await PatientData.findOne({
            $or: [
                {Id:req.params.id},
                {Mobile:req.params.id},
                
            ],
            isCancelled:false, isValid:true
        })
        let visit = await VisitData.find({Patient:patient._id},'Fees createdAt').sort({"createdAt": -1}).limit(1);
        if(patient){
            return res.status(200).json({
                patient,
                visit
            })
        }else{
            return res.status(404).json({
                message:'No patient found'
            })
        }
          
    }catch(err){
          console.log(err);
          return res.status(500).json({
                message:'Error 500 : Unable to find patient'
          })
    }   
}


module.exports.bookVisitToday = async function(req, res){
    let patient = await PatientData.findOne({
        $or: [
            {Id:req.body.PatientId},
            {Mobile:req.body.PatientId},
            
        ],
        isCancelled:false, isValid:true
        
    })
    let tracker = await Tracker.findOne({});
    
    if(!patient || patient == null){
        return res.status(404).json({
            message:'Invalid Patient Id'
        })
    }
    try{
        let visit = await VisitData.create({
            Patient:patient._id,
            Type:req.body.Type,
            Fees:req.body.Fees,
            Doctor:req.body.Doctor,
            Visit_date:new Date().toISOString().split('T')[0],
            Outside_docs:req.body.Outside_docs
        });
        patient.Visits.push(visit._id);
        await patient.save();
        let updatedReportNo = +tracker.AppointmentNumber + 1
        let sale = await Sales.create({
            ReportNo:'APMT'+tracker.AppointmentNumber,
            Name:patient.Name,
            Age:patient.Age,
            Address:patient.Address,
            Mobile:patient.Mobile,
            Doctor:patient.Doctor,
            Gender:patient.Gender,
            PatiendID:patient.Id,
            Items:['Appointment$1$'+req.body.Fees],
            type:'Appointment'
        })
        await tracker.updateOne({AppointmentNumber:updatedReportNo})
        await visit.updateOne({SaleId:sale._id})
        return res.status(200).json({
            message:'Visit Scheduled',
            visit:sale._id
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:'Internal server error : Unable to add visit'
        })
    }
}

module.exports.changeVisitStatus = async function(req, res){
    try{
        if(req.user.Role == 'Admin'){
            let visit = await VisitData.findByIdAndUpdate(req.body.id, { isValid:req.body.status});
            await Sales.findByIdAndUpdate(visit.SaleId,{isValid:req.body.status})
            return res.status(200).json({
                message:'Status changed'
            })
        }else{
            return res.status(403).json({
                message:'Unauthorized request, please check with admin'
            })
        }
        
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:'Internal server Error : Unable to change status'
        })
    }
}

module.exports.IPDpatientRegistration = function(req, res){
    try{
        return res.render('IPDRegistration');
    }catch(err){
        return res.render('Error_500');
    }
    
}

module.exports.admitPatient = async function(req, res){
    let id;
    try{
          id = await Tracker.findOne({});
    }catch(err){
          return res.status(500).json({
                message:'Unable to generate patient ID'
          })
    }
    try{
          let patient = await AdmittedPatients.create(req.body);
          let newId = Number(id.AdmissionNo) + 1
          await id.updateOne({AdmissionNo:newId})
          await patient.updateOne({AdmissionNo:newId});
          return res.status(200).json({
                message:'Patient Admitted'
          })
    }catch(err){
          console.log(err)
          return res.status(500).json({
                message:'Unable to admit patient'
          })
    }
}

module.exports.showAdmitted = async function(req, res){
    try{
          let patients = await AdmittedPatients.find({}).sort([['createdAt',-1]]);
          return res.render('showAdmittedPatients',{patients})
    }catch(err){
          console.log(err)
          return res.render('Error_500')
    }
    
}

module.exports.admittedPatientProfile = function(req, res){
    try{
        if(req.user.Role == 'Admin'){
            return res.render('admittedPatientProfile')
        }else{
            return res.render('Error_403')
        }
        
    }catch(err){
        return res.render('Error_500')
    }
}
function getSixHourTimeframes(startDate, startTime, endDate, endTime) {
    // Combine the date and time into full Date objects
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);
    console.log(startDateTime)
    console.log(endDateTime)
    // Calculate the total difference in milliseconds
    const timeDiff = endDateTime - startDateTime;
    
    // Convert the difference to hours (1 hour = 3,600,000 milliseconds)
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    // Return the number of 6-hour timeframes (rounding down)
    return Math.floor(hoursDiff / 6);
}


module.exports.showPrescription = async function(req, res){
    try{
        let visit = await VisitData.findById(req.params.visitId).populate('Patient');
        return res.render('prescriptionForm', {visit})
    }catch(err){
        return res.render('Error_500')
    }
}