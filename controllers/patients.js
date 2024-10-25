const PatientData = require('../models/patients');
const VisitData = require('../models/visits');
const Tracker = require('../models/tracker');
const Sales = require('../models/sales');
const AdmittedPatients = require('../models/admittedPatients');
const ServicesData = require('../models/servicesAndCharges')
const SalesData = require('../models/sales')
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
            Type:'OPD',
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
            type:'Appointment',
            Total:req.body.Fees
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
            visits = await VisitData.find({Visit_date:date, isCancelled:false, Type:'OPD'}).populate('Patient');
        }else{
            visits = await VisitData.find({Visit_date:date, isCancelled:false, isValid:true, Type:'OPD'}).populate('Patient');
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
                {isCancelled:false, isValid:true, Type:'OPD'}
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
            visits = await VisitData.find({Visit_date:date,isCancelled:false, Type:'OPD'}).populate('Patient');
        }else{
            visits = await VisitData.find({Visit_date:date,isCancelled:false, isValid:true, Type:'OPD'}).populate('Patient');
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
            Type:'OPD',
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
            type:'Appointment',
            Total:req.body.Fees
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
    console.log(req.body);
    let id;
    try{
          id = await Tracker.findOne({});
    }catch(err){
          return res.status(500).json({
                message:'Unable to generate patient ID'
          })
    }
    try{
          let patient = await PatientData.create(req.body);
          let newId = Number(id.patientId) + 1
          await id.updateOne({patientId:newId})
          let visit = await VisitData.create({
            Patient:patient._id,
            Visit_date:req.body.AdmissionDate,
            Doctor:req.body.Doctor,
            Type:'IPD',
            AdmissionDate:req.body.AdmissionDate,
            AdmissionTime:req.body.AdmissionTime,
            Reason:req.body.Reason,
            BroughtBy:req.body.BroughtBy
          })
          await patient.updateOne({$push:{Visits:visit._id}, Id:newId});
          patient.Visits.push(visit._id);
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
          let visits = await VisitData.find({Type:'IPD'}).populate('Patient').sort([['createdAt',-1]]);
          let rooms = await ServicesData.find({Type:'RoomCharges'});
          return res.render('showAdmittedPatients',{visits, rooms})
          console.log(rooms);
          console.log(visits);
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

module.exports.saveDischargeDate = async function(req, res){
    try{
        let dischargeDate = req.body.dischargeDate.split('T')[0];
        let dischargeTime = req.body.dischargeDate.split('T')[1];
        await VisitData.findByIdAndUpdate(req.body.visitId,{DischargeDate:dischargeDate, DischargeTime:dischargeTime});
        return res.status(200).json({
            message:'Discharge date updated'
        })
    }catch(err){
        return res.status(500).json({
            message:'Unable to update discharge date'
        })
    }
}

module.exports.saveRoomType = async function(req, res){
    try{
        await VisitData.findByIdAndUpdate(req.body.visitId,{RoomType:req.body.RoomType});
        return res.status(200).json({
            message:'Room type updated'
        })
    }catch(err){
        return res.status(500).json({
            message:'Unable to update Room type'
        })
    }
}
    
module.exports.AdmissionBill = async function(req, res){
    try{
        let visit = await VisitData.findById(req.params.visitId).populate('Patient');
        let bill = visit.Patient
        let Items = await ServicesData.find({Type:'AdmissionBill'});
        let daysCount = get24HourTimeframes(visit.AdmissionDate, visit.AdmissionTime, visit.DischargeDate, visit.DischargeTime);
        let room = await ServicesData.findOne({Name:visit.RoomType, Type:'RoomCharges'});
        return res.render('AdmissionBill',{bill, Items, roomCharges:room.Price,daysCount, visit_id:visit._id, isDischarged:visit.isDischarged});
    }catch(err){    
        console.log(err);
        return res.render('Error_500')
    }
}



module.exports.saveDischargeBill = async function(req, res){
    try{
        let visit = await VisitData.findById(req.body.visitId).populate('Patient');
        if(visit){
            await visit.updateOne({isDischarged:true})
            let Items = await ServicesData.find({Type:'AdmissionBill'});
            let billItems = new Array()
            let daysCount = get24HourTimeframes(visit.AdmissionDate, visit.AdmissionTime, visit.DischargeDate, visit.DischargeTime);
            let room = await ServicesData.findOne({Name:visit.RoomType, Type:'RoomCharges'});
            let total = 0
            for(let i=0;i<Items.length;i++){
                let item = Items[i].Name+'$1$'+Items[i].Price+'$'+Items[i].Notes
                total = total + Items[i].Price
                billItems.push(item)
            }
            billItems.push('Room Charges ('+daysCount+' days)$1$'+ +room.Price*daysCount+'$');
            total = total + +room.Price*daysCount
            let bill = await Tracker.findOne();
            let newBillNo = +bill.AdmissionNo + 1;
            await bill.updateOne({AdmissionNo:newBillNo});
            let sale = await SalesData.create({
                Patient:visit.Patient,
                Name:visit.Patient.Name,
                Age:visit.Patient.Age,
                Address:visit.Patient.Address,
                Mobile:visit.Patient.Mobile,
                Gender:visit.Patient.Gender,
                PatiendID:visit.Patient.Id,
                Doctor:visit.Doctor,
                type:'DischargeBill',
                Items:billItems,
                ReportNo:"DSCH"+newBillNo,
                Total:total
            })
            return res.status(200).json({
                sale
            })
        }else{
            return res.status(400).json({
                message:'Invalid visit'
            })
        }
        
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:'Unable to save bill'
        })
    }
}


function get24HourTimeframes(startDate, startTime, endDate, endTime) {
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
    return Math.ceil(hoursDiff / 24);
}


module.exports.showPrescription = async function(req, res){
    try{
        let visit = await VisitData.findById(req.params.visitId).populate('Patient');
        if(req.xhr){
            return res.status(200).json({
                visitData:visit.VisitData
            })
        }
        return res.render('prescriptionForm', {visit})
    }catch(err){
        console.log(err)
        return res.render('Error_500')
    }
}

module.exports.dischargeSheet = async function(req, res){
    try{
        let visit = await VisitData.findById(req.params.id).populate('Patient');
        return res.render('dischargeSheetTemplate', {visit})
    }catch(err){
        console.log(err);
        return res.render('Error_500')
    }
}

module.exports.saveVisitData = async function(req, res){
    try{
        await VisitData.findByIdAndUpdate(req.body.visitId, {VisitData:req.body.visitData});
        return res.status(200).json({
            message:'Prescription saved'
        })
    }catch(err){
        return res.status(500).json({
            message:'Unable to save prescription'
        })
    }
}