const express = require('express');
const Router = express.Router();
const reportsController = require('../controllers/reports');
const passport = require('../configs/passport-local-strategy')
Router.get('/home/:id', passport.checkAuthentication, reportsController.PathalogyHome);
Router.get('/new/home', passport.checkAuthentication, reportsController.PathalogyHomeEmpty)
Router.post('/save', passport.checkAuthentication, reportsController.saveReport);
Router.get('/view/:pid', passport.checkAuthentication, reportsController.viewReport);
Router.get('/history/home', passport.checkAuthentication, reportsController.pathologyHistoryHome);

Router.get('/getHistoryByRange', passport.checkAuthentication, reportsController.getHistoryByRange);
Router.get('/getHistoryByDate', passport.checkAuthentication, reportsController.getHistoryByDate);
Router.get('/getHistoryById', passport.checkAuthentication, reportsController.getHistoryById);

Router.get('/getBirthHistoryByRange', passport.checkAuthentication, reportsController.getBirthHistoryByRange);
Router.get('/getBirthHistoryByDate', passport.checkAuthentication, reportsController.getBirthHistoryByDate);
Router.get('/getBirthHistoryById', passport.checkAuthentication, reportsController.getBirthHistoryById);

Router.get('/getAllServices', passport.checkAuthentication, reportsController.getAllServices);
Router.get('/getServiceByName', passport.checkAuthentication, reportsController.getServiceByName);
Router.get('/getByReportNumber', passport.checkAuthentication,reportsController.getReportByNumber);
Router.get('/getDefaultTests', passport.checkAuthentication, reportsController.getDefaultTests);
Router.post('/saveService', passport.checkAuthentication , reportsController.addServicesData);
Router.post('/saveServiceSettings', passport.checkAuthentication, reportsController.saveServicesUpdates);
Router.get('/getDashboardData', passport.checkAuthentication, reportsController.dashboard);
Router.delete('/deleteService/:serviceId', passport.checkAuthentication, reportsController.deleteService);
Router.post('/cancel', passport.checkAuthentication, reportsController.cancelReport);
Router.post('/birthCertificate/cancel/', passport.checkAuthentication, reportsController.cancelBirthReport);
Router.get('/birthCertificates', passport.checkAuthentication, reportsController.birthCertificateHistory)


module.exports = Router;