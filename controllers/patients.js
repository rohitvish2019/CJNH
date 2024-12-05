const PatientData = require('../models/patients');
const VisitData = require('../models/visits');
const Tracker = require('../models/tracker');
const Sales = require('../models/sales');
const AdmittedPatients = require('../models/admittedPatients');
const Reportsdata = require('../models/reports')
const ServicesData = require('../models/servicesAndCharges')
const SalesData = require('../models/sales');
const MedsData = require('../models/meds');
const BirthData = require('../models/birthCertificates')
module.exports.patientRegistartionHome = function(req, res){
    try{
        return res.render('patientRegistration',{user:req.user})
    }catch(err){
        console.log(err)
        return res.render('Error_500')
    }
}

module.exports.oldAppointmentsHome = function(req, res){
    try{
        if(req.user.Role == 'Admin'){
            return res.render('oldAppointments',{user:req.user})
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
        console.log(req.body);
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
                Gender:req.body.Gender,
                Husband:req.body.Husband,
                IdProof:req.body.IdProof
            });
            await tracker.updateOne({patientId:newPatientId})
        }
        let visit = await VisitData.create({
            Patient:patient._id,
            Type:'OPD',
            Fees:req.body.Fees,
            Doctor:req.body.Doctor,
            Visit_date:req.body.AppointmentDate,
            Outside_docs:req.body.Outside_docs,
            PaymentType:req.body.paymentType
        });
        let updatedReportNo = +tracker.AppointmentNumber + 1
        await patient.updateOne({$push:{Visits:visit._id}});
        let sale = await Sales.create({
            ReportNo:'OPD'+tracker.AppointmentNumber,
            Name:req.body.Name,
            Age:req.body.Age,
            Address:req.body.Address,
            Mobile:req.body.Mobile,
            Doctor:req.body.Doctor,
            Gender:req.body.Gender,
            PatiendID:newPatientId,
            Items:['OPD$1$'+req.body.Fees],
            type:'Appointment',
            Total:req.body.Fees,
            PaymentType:req.body.paymentType
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
        let day = new Date().getDate().toString().padStart(2,'0')
        let month = +new Date().getMonth()
        let year = new Date().getFullYear()
        //let date =  new Date().toISOString().split('T')[0];
        let date = year +'-'+ (month+1).toString().padStart(2,'0') +'-'+ day;
        let visits;
        console.log(date)
        if(req.query.status == 'true'){
            visits = await VisitData.find({Visit_date:date, isCancelled:false, Type:'OPD', Doctor:req.user.Name}).populate('Patient');
        }else{
            visits = await VisitData.find({Visit_date:date, isCancelled:false, isValid:true, Type:'OPD',Doctor:req.user.Name}).populate('Patient');
        }

        if(req.xhr){
            console.log('It is a xhr request')
            return res.status(200).json({
                visits
            })
        }else{
            return res.render('showAppointments',{visits,user:req.user});
        }
        
    }catch(err){
        console.log(err)
        return res.render('Error_500');
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
    try{
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
        console.log(req.body.patient)
        await patient.updateOne(req.body.patient);
        let visit = await VisitData.create({
            Patient:patient._id,
            Type:'OPD',
            Fees:req.body.Fees,
            Doctor:req.body.Doctor,
            Visit_date:req.body.date,
            Outside_docs:req.body.Outside_docs,
            PaymentType:req.body.paymentType
        });
        patient.Visits.push(visit._id);
        await patient.save();
        let updatedReportNo = +tracker.AppointmentNumber + 1
        let sale = await Sales.create({
            ReportNo:'OPD'+tracker.AppointmentNumber,
            Name:patient.Name,
            Age:patient.Age,
            Address:patient.Address,
            IdProof:req.body.IdProof,
            Mobile:patient.Mobile,
            Doctor:req.body.Doctor,
            Gender:patient.Gender,
            PatiendID:patient.Id,
            Items:['OPD$1$'+req.body.Fees],
            type:'Appointment',
            Total:req.body.Fees,
            PaymentType:req.body.paymentType
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
        return res.render('IPDRegistration',{user:req.user});
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
        let patient = null;
        let newId
        let newIPDNumber
        if(req.body.id != ''){
            patient = await PatientData.findOne({Id:req.body.id})
            newId = patient.Id
            newIPDNumber = Number(id.IPDNumber) + 1;
            await id.updateOne({IPDNumber: newIPDNumber})
            if(!patient || patient == null){
                return res.status(400).json({
                    message:'Invalid patient ID'
                })
            }
        }else{
            patient = await PatientData.create(req.body.data);
            newId = Number(id.patientId) + 1
            newIPDNumber = Number(id.IPDNumber) + 1;
            await id.updateOne({patientId:newId, IPDNumber: newIPDNumber})
        }
        
        
        
        let visit = await VisitData.create({
        Patient:patient._id,
        IPDNumber: newIPDNumber,
        Visit_date:req.body.data.AdmissionDate,
        Doctor:req.body.data.Doctor,
        Type:'IPD',
        AdmissionDate:req.body.data.AdmissionDate,
        AdmissionTime:req.body.data.AdmissionTime,
        Reason:req.body.data.Reason,
        BroughtBy:req.body.data.BroughtBy
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
        let threeYearOld = new Date(new Date().setFullYear(new Date().getFullYear() - 3));
        let visits = await VisitData.find({isCancelled:false,isValid:true,Type:'IPD', createdAt :{$gte : threeYearOld}}).populate('Patient').sort([['createdAt',-1]]);
        let rooms = await ServicesData.find({Type:'RoomCharges'});
        return res.render('showAdmittedPatients',{visits, rooms, user:req.user})
        
    }catch(err){
        console.log(err)
        return res.render('Error_500')
    }
}

module.exports.admittedPatientProfile = function(req, res){
    try{
        if(req.user.Role == 'Admin'){
            return res.render('admittedPatientProfile',{user:req.user})
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
        return res.render('AdmissionBill',{bill, Items, roomCharges:room.Price,daysCount, visit_id:visit._id, isDischarged:visit.isDischarged, user:req.user});
    }catch(err){    
        console.log(err);
        return res.render('Error_500')
    }
}

module.exports.getAdmissionBillItems = async function(req, res){
    try{
        let visit = await VisitData.findById(req.query.visitid).populate('Patient');
        let Items = await ServicesData.find({Type:'AdmissionBill'},'Name Price');
        let daysCount = get24HourTimeframes(visit.AdmissionDate, visit.AdmissionTime, visit.DischargeDate, visit.DischargeTime);
        let room = await ServicesData.findOne({Name:visit.RoomType, Type:'RoomCharges'});
        let advancedPayments = visit.advancedPayments;
        return res.status(200).json({
            visit,
            Items,
            daysCount,
            roomRent : room.Price,
            advancedPayments
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Unable to find admission billing items'
        })
    }
}

module.exports.saveDischargeBill = async function(req, res){
    try{
        let visit = await VisitData.findById(req.body.visitId).populate('Patient');
        let billItems = new Array()
        let total = 0
        if(visit){
            console.log(req.body);
            let keys = Object.keys(req.body.dischargeItems);
            for(let i=0;i<keys.length;i++){
                let item = req.body.dischargeItems[keys[i]].Name+'$1$'+req.body.dischargeItems[keys[i]].Price
                total = total + +req.body.dischargeItems[keys[i]].Price
                billItems.push(item)
            }
            await visit.updateOne({isDischarged:true});
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
                PaymentType:req.body.paymentType,
                type:'DischargeBill',
                Items:billItems,
                ReportNo:"DSCH"+newBillNo,
                Total:total
            })
            
            /*
            
            let Items = await ServicesData.find({Type:'AdmissionBill'});
            
            let daysCount = get24HourTimeframes(visit.AdmissionDate, visit.AdmissionTime, visit.DischargeDate, visit.DischargeTime);
            let room = await ServicesData.findOne({Name:visit.RoomType, Type:'RoomCharges'});
            
            
            billItems.push('Room Charges ('+daysCount+' days)$1$'+ +room.Price*daysCount+'$');
            total = total + +room.Price*daysCount
            
            
                */
            return res.status(200).json({
                sale:sale._id,
                message:'Bill Saved'
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
        let medsList = await MedsData.find({}).sort('Category')
        let visit = await VisitData.findById(req.params.visitId).populate('Patient');
        if(req.xhr){
            return res.status(200).json({
                visitData:visit.VisitData,
                Prescriptions: visit.Prescriptions,
                medsList
            })
        }
        return res.render('prescriptionForm', {visit, user:req.user, medsList})
    }catch(err){
        console.log(err)
        return res.render('Error_500')
    }
}

module.exports.dischargeSheet = async function(req, res){
    try{
        let visit = await VisitData.findById(req.params.id).populate('Patient');
        let meds = await MedsData.find({Type:'DischargeMed'});
        return res.render('dischargeSheetTemplate', {visit, user:req.user, meds})
    }catch(err){
        console.log(err);
        return res.render('Error_500')
    }
}

module.exports.saveVisitData = async function(req, res){
    try{
        await VisitData.findByIdAndUpdate(req.body.visitId, {VisitData:req.body.visitData, Prescriptions:req.body.prescribedMeds});
        return res.status(200).json({
            message:'Prescription saved'
        })
    }catch(err){
        return res.status(500).json({
            message:'Unable to save prescription'
        })
    }
}

module.exports.patientHistoryHome = async function(req, res){
    try{
        let patient = await PatientData.findById(req.params.patientId);
        return res.render('patientHistory',{patient, user:req.user})
    }catch(err){
        return res.render('Error_500')
    }
}

module.exports.getAllVisits = async function(req, res){
    try{
        let visits = await VisitData.find({Patient:req.params.patientId},'VisitData Visit_date Prescriptions OtherDocs').sort({createdAt:-1});
        //let patient = await PatientData.findOne({Id:});
        let reports = await Reportsdata.find({Patient:req.params.patientId, isCancelled:false, isValid:true});
        return res.status(200).json({
            visits,
            reports
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:'Unable to get visits'
        })
    }
}


module.exports.birthCertificateHome = async function(req, res){
    try{
        let patient = await PatientData.findById(req.params.pid);
        let certificate = await BirthData.findOne({OPDId:patient.Id});
        return res.render('birthCertificateHome', {patient, certificate});
    }catch(err){
        console.log(err);
        return res.render('Error_500')
    }
}

module.exports.saveBirthDetails = async function(req, res){
    try{
        let pid = req.body.OPDId;
        
        /*
        let cert = await BirthData.findOne({OPDId:pid});
        if(cert){
            await cert.updateOne({
                Name:req.body.Name,
                Husband:req.body.Husband,
                Age:req.body.Age,
                Village:req.body.Village,
                Tahsil:req.body.Tahsil,
                District:req.body.District,
                State:req.body.State,
                DeliveryType:req.body.DeliveryType,
                Gender:req.body.Gender,
                BirthTime:req.body.BirthTime,
                BirthDate:req.body.BirthDate,
                ChildWeight:req.body.ChildWeight,
            })
            return res.status(200).json({
                message:'Birth details updated',
                id:cert._id
            })
        }else{
        */
            if(pid && pid != null && pid != ''){
                let birthCertNumber = await Tracker.findOne({});
                let newBirthCertNumber = +birthCertNumber.BirthCertificateNumber + 1;
                let patient = await PatientData.findOne({Id:pid});
                let visits = await VisitData.find({Patient:patient._id, Type:'IPD'}).sort({createdAt:-1})

                let bcert = await BirthData.create({
                    CertificateNumber:"BCERT"+newBirthCertNumber,
                    Visit:visits[0]._id,
                    OPDId:pid,
                    Name:patient.Name,
                    Husband:patient.Husband,
                    Age:patient.Age,
                    Village:req.body.Village,
                    Tahsil:req.body.Tahsil,
                    District:req.body.District,
                    State:req.body.State,
                    DeliveryType:req.body.DeliveryType,
                    Gender:req.body.Gender,
                    BirthTime:req.body.BirthTime,
                    BirthDate:req.body.BirthDate,
                    ChildWeight:req.body.ChildWeight,
                    GeneratedOn:req.body.BirthDate,
                })
                await birthCertNumber.updateOne({BirthCertificateNumber:newBirthCertNumber})
                
                return res.status(200).json({
                    message:'Birth Certificate created',
                    id:bcert._id
                })
            }else{
                return res.status(400).json({
                    message:'Invalid patient ID'
                })
            }
        //}
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Unable to generate birth certificate',
        })
    }
}

module.exports.viewBirthCertificate = async function(req, res){
    try{
        let cert = await BirthData.findById(req.params.certId);
        return res.render('birthCertificateTemplate',{cert})
    }catch(err){
        console.log(err)
        return res.render('Error_500')
    }
}

module.exports.addAdvancePayment = async function(req, res){
    try{
        let day = new Date().getDate()
        let month = +new Date().getMonth()
        let year = new Date().getFullYear()
        let date = day +'-'+ (month+1) +'-'+ year
        let visit = await VisitData.findById(req.body.visitId).populate('Patient');
        visit.advancedPayments.push("Advance Received$-"+req.body.Amount+"$"+date);
        await visit.save();
        let bill = await Tracker.findOne();
        let newBillNo = +bill.AdvancePaymentNumber + 1;
        let sale = await SalesData.create({
            Patient:visit.Patient,
            Name:visit.Patient.Name,
            Age:visit.Patient.Age,
            Address:visit.Patient.Address,
            Mobile:visit.Patient.Mobile,
            Gender:visit.Patient.Gender,
            PatiendID:visit.Patient.Id,
            Doctor:visit.Doctor,
            PaymentType:req.body.paymentType,
            type:'IPDAdvance',
            Items:["Advanced Received$1$"+req.body.Amount],
            ReportNo:"IPDAD"+newBillNo,
            Total:req.body.Amount
        })
        await bill.updateOne({AdvancePaymentNumber:newBillNo})
        return res.status(200).json({
            message:'advance payment added',
            saledId : sale._id
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:'Unable to add in advance payments'
        })
    }
}

module.exports.saveWeight = async function(req, res){
    try{
        await VisitData.findByIdAndUpdate(req.body.visitId,{weight:req.body.weight});
        return res.status(200).json({
            message:'Weight saved'
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:'unable to save weight'
        })
    }
}

module.exports.cancelIPD = async function(req, res){
    try{
        await VisitData.findByIdAndUpdate(req.params.id,{isCancelled:true});
        return res.status(200).json({
            message:'IPD cancelled'
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:'Unable to cancel IPD'
        })
    }
}


module.exports.saveDischargeData = async function(req, res){
    try{
        await VisitData.findByIdAndUpdate(req.body.id, {DischargeData:req.body.changes});
        return res.status(200).json({
            message:'Discharge Data saved'
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message :'Unable to save discharge data'
        })
    }
}

module.exports.getDischargeData = async function(req, res){
    try{
        let visit = await VisitData.findByIdAndUpdate(req.params.id);
        return res.status(200).json({
            dd:visit.DischargeData,
            message:'result found'
        })
    }catch(err){
        return res.status(500).json({
            message:'Unable to find data'
        })
    }
}