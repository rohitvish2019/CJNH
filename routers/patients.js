const express = require('express');
const Router = express.Router();
const PatientsController = require('../controllers/patients')
const passport = require('../configs/passport-local-strategy')
Router.post('/addVisit',passport.checkAuthentication,  PatientsController.addVisitAndPatient);
Router.get('/getAppointments/today', passport.checkAuthentication, PatientsController.getAppointmentsToday);
Router.get('/getAppointments/old', passport.checkAuthentication, PatientsController.oldAppointmentsHome);
Router.get('/getAppointmentsByDate',passport.checkAuthentication,  PatientsController.getAppointmentsByDate);
Router.get('/new', passport.checkAuthentication, PatientsController.patientRegistartionHome)
Router.get('/get/:id', passport.checkAuthentication, PatientsController.getPatientById);
Router.post('/visits/bookToday', passport.checkAuthentication, PatientsController.bookVisitToday);
Router.get('/getPatientById/:id', passport.checkAuthentication, PatientsController.getPatientById);
Router.post('/visits/changeStatus', passport.checkAuthentication, PatientsController.changeVisitStatus)
Router.get('/IPD/new', passport.checkAuthentication, PatientsController.IPDpatientRegistration);
Router.post('/admit', passport.checkAuthentication, PatientsController.admitPatient);
Router.get('/showAdmitted', passport.checkAuthentication, PatientsController.showAdmitted);
Router.get('/viewAdmitted/:id', passport.checkAuthentication, PatientsController.admittedPatientProfile);
Router.get('/getPrescription/:visitId', passport.checkAuthentication, PatientsController.showPrescription);
Router.get('/dischargeSheet/:id', passport.checkAuthentication, PatientsController.dischargeSheet);
Router.get('/DischargeReceipt/:id', passport.checkAuthentication, PatientsController.dischargeReceipt);
Router.post('/saveDischargeDate', passport.checkAuthentication, PatientsController.saveDischargeDate);
Router.post('/saveRoomType', passport.checkAuthentication, PatientsController.saveRoomType);
Router.post('/saveDeliveryType', passport.checkAuthentication, PatientsController.saveDeliveryType);
Router.get('/AdmissionBill/:visitId', passport.checkAuthentication, PatientsController.AdmissionBill);
Router.post('/saveDischargeBill', passport.checkAuthentication, PatientsController.saveDischargeBill);
Router.post('/saveVisitPrescriptions', passport.checkAuthentication, PatientsController.saveVisitData);
Router.get('/getHistory/:patientId', passport.checkAuthentication, PatientsController.patientHistoryHome);
Router.get('/getAllVisits/:patientId', passport.checkAuthentication,  PatientsController.getAllVisits);
Router.get('/getDischargeBillItems', passport.checkAuthentication, PatientsController.getAdmissionBillItems);
Router.get('/birthCertificate/:pid', passport.checkAuthentication, PatientsController.birthCertificateHome);
Router.post('/birthCertificate/save', passport.checkAuthentication, PatientsController.saveBirthDetails);
Router.post('/add/advancePayment', passport.checkAuthentication, PatientsController.addAdvancePayment);
Router.post('/saveWeight', passport.checkAuthentication, PatientsController.saveWeight);
Router.get('/birthCertificate/view/:certId', passport.checkAuthentication, PatientsController.viewBirthCertificate);
Router.post('/cancel/IPD/:id', passport.checkAuthentication, PatientsController.cancelIPD);
Router.post('/save/dischargeData', passport.checkAuthentication, PatientsController.saveDischargeData);
Router.get('/get/dischargeData/:id', passport.checkAuthentication, PatientsController.getDischargeData);
Router.get('/getIPDData/Range', passport.checkAuthentication, PatientsController.getIPDData);
module.exports = Router;