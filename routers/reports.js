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
Router.get('/getAllServices', passport.checkAuthentication, reportsController.getAllServices);
Router.get('/getServiceByName', passport.checkAuthentication, reportsController.getServiceByName);
module.exports = Router;