const express = require('express');
const Router = express.Router();
const PatientsController = require('../controllers/patients')
Router.get('/test', PatientsController.test)
Router.post('/addVisit', PatientsController.addVisitAndPatient);
Router.get('/getAppointments/today', PatientsController.getAppointmentsToday);
Router.get('/getAppointments/old', PatientsController.oldAppointmentsHome);
Router.get('/getAppointmentsByDate', PatientsController.getAppointmentsByDate);
Router.get('/new', PatientsController.patientRegistartionHome)
Router.get('/get/:id', PatientsController.getPatientById);
Router.post('/visits/bookToday', PatientsController.bookVisitToday);
Router.get('/getPatientById/:id', PatientsController.getPatientById)
module.exports = Router;