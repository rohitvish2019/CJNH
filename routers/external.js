const express = require('express');
const Router = express.Router();
const passport = require('../configs/passport-local-strategy')
const ExternalController = require('../controllers/external');
Router.get('/online-appointments', passport.checkAuthentication, ExternalController.onlineAppointmentsHome);  
Router.get('/getAppointments', passport.checkAuthentication, ExternalController.getAppointments);  
Router.post('/acceptAppointment', passport.checkAuthentication, ExternalController.acceptAppointment);
Router.post('/linkAndAcceptAppointment', passport.checkAuthentication, ExternalController.linkAndAcceptAppointment);

// Second Doctor Routes
Router.get('/doctor-appointments', passport.checkAuthentication, ExternalController.doctorAppointmentsHome);
Router.get('/getDoctorAppointments', passport.checkAuthentication, ExternalController.getDoctorAppointments);
Router.post('/acceptDoctorAppointment', passport.checkAuthentication, ExternalController.acceptDoctorAppointment);
Router.post('/linkAndAcceptDoctorAppointment', passport.checkAuthentication, ExternalController.linkAndAcceptDoctorAppointment);

module.exports = Router;
