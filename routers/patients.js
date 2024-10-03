const express = require('express');
const Router = express.Router();
const PatientsController = require('../controllers/patients')
Router.get('/test', PatientsController.test)
Router.post('/addVisit', PatientsController.addVisitAndPatient);
Router.get('/getAppointments/today', PatientsController.getAppointmentsToday)
module.exports = Router;