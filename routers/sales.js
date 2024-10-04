const express = require('express');
const Router = express.Router();
const SalesController = require('../controllers/sales')
Router.get('/History/home', SalesController.salesHistoryHome)
module.exports = Router;