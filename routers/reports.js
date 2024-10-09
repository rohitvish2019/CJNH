const express = require('express');
const Router = express.Router();
const reportsController = require('../controllers/reports');
Router.get('/home/:id', reportsController.PathalogyHome);
Router.post('/save', reportsController.saveReport);
Router.get('/view', reportsController.viewReport)
module.exports = Router;