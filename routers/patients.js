const express = require('express');
const Router = express.Router();
const PatientsController = require('../controllers/patients')
Router.post('/addVisit', PatientsController.addVisitAndPatient);
Router.get('/getAppointments/today', PatientsController.getAppointmentsToday);
Router.get('/getAppointments/old', PatientsController.oldAppointmentsHome);
Router.get('/getAppointmentsByDate', PatientsController.getAppointmentsByDate);
Router.get('/new', PatientsController.patientRegistartionHome)
Router.get('/get/:id', PatientsController.getPatientById);
Router.post('/visits/bookToday', PatientsController.bookVisitToday);
Router.get('/getPatientById/:id', PatientsController.getPatientById);
Router.post('/visits/changeStatus', PatientsController.changeVisitStatus);
Router.get('/IPD/new', PatientsController.IPDpatientRegistration);
Router.post('/admit', PatientsController.admitPatient);
Router.get('/showAdmitted', PatientsController.showAdmitted);
Router.get('/viewAdmitted/:id', PatientsController.admittedPatientProfile)
module.exports = Router;