const express = require('express');
const Router = express.Router();
const reportsController = require('../controllers/reports');
Router.get('/home/:id', reportsController.PathalogyHome)
module.exports = Router;