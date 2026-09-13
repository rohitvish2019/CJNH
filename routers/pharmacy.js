const express = require('express');
const Router = express.Router();
const pharmacyController = require('../controllers/pharmacy');
const passport = require('../configs/passport-local-strategy');

Router.get('/stock', passport.checkAuthentication, pharmacyController.stockHome);
Router.post('/stock', passport.checkAuthentication, pharmacyController.addStock);
Router.get('/purchase-history', passport.checkAuthentication, pharmacyController.purchaseHistoryHome);
Router.get('/purchase-history/search', passport.checkAuthentication, pharmacyController.getPurchaseHistory);
Router.get('/manage-stock', passport.checkAuthentication, pharmacyController.manageStockHome);
Router.get('/manage-stock/search', passport.checkAuthentication, pharmacyController.searchStock);
Router.post('/manage-stock/:id/add', passport.checkAuthentication, pharmacyController.addStockToBatch);
Router.get('/billing', passport.checkAuthentication, pharmacyController.billingHome);
Router.get('/medicine', passport.checkAuthentication, pharmacyController.getMedicine);
Router.get('/allocate', passport.checkAuthentication, pharmacyController.allocateMedicineStock);

module.exports = Router;
