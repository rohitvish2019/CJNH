const express = require('express');
const Router = express.Router();
const reportsController = require('../controllers/reports');
Router.get('/home/:id', reportsController.PathalogyHome);
Router.get('/new/home', reportsController.PathalogyHomeEmpty)
Router.post('/save', reportsController.saveReport);
Router.get('/view/:pid', reportsController.viewReport);
Router.get('/history/home', reportsController.pathologyHistoryHome);
Router.get('/getHistoryByRange', reportsController.getHistoryByRange);
Router.get('/getHistoryByDate', reportsController.getHistoryByDate);
Router.get('/getAllServices', reportsController.getAllServices);
Router.get('/getServiceByName', reportsController.getServiceByName);
Router.get('/getByReportNumber', reportsController.getReportByNumber);

module.exports = Router;