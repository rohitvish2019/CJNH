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
Router.post('/saveDischargeDate', passport.checkAuthentication, PatientsController.saveDischargeDate);
Router.post('/saveRoomType', passport.checkAuthentication, PatientsController.saveRoomType);
Router.get('/AdmissionBill/:visitId', passport.checkAuthentication, PatientsController.AdmissionBill);
Router.post('/saveDischargeBill', passport.checkAuthentication, PatientsController.saveDischargeBill)
module.exports = Router;