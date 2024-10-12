const express = require('express');
const Router = express.Router();
const SalesController = require('../controllers/sales')
Router.get('/History/home', SalesController.salesHistoryHome);
Router.get('/bill/pathology', SalesController.newPathologyBill);
Router.post('/saveBill', SalesController.addSales);
Router.get('/bill/view/:id', SalesController.getBillById)
module.exports = Router;