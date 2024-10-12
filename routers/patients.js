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
module.exports = Router;