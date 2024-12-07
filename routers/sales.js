const express = require('express');
const Router = express.Router();
const SalesController = require('../controllers/sales');
const passport = require('../configs/passport-local-strategy')
Router.get('/History/home',passport.checkAuthentication, SalesController.salesHistoryHome);
Router.get('/bill/pathology', passport.checkAuthentication, SalesController.newPathologyBill);
Router.get('/bill/ultrasound', passport.checkAuthentication, SalesController.newUltrasoundBill);
Router.get('/bill/others', passport.checkAuthentication, SalesController.newOtherBill);
Router.post('/saveBill', passport.checkAuthentication, SalesController.addSales);
Router.get('/bill/view/:id', passport.checkAuthentication, SalesController.getBillById);
Router.get('/getHistoryByDate', passport.checkAuthentication, SalesController.getBillsByDate);
Router.get('/getHistoryByRange', passport.checkAuthentication, SalesController.getBillsByDateRange);
Router.delete('/cancel/', passport.checkAuthentication, SalesController.cancelSale);
Router.get('/validateBill', passport.checkAuthentication, SalesController.validateBill)
module.exports = Router;