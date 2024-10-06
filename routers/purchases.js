const express = require('express');
const Router = express.Router();
const purchaseController = require('../controllers/purchases');
Router.get('/home', purchaseController.home);
Router.get('/history', purchaseController.purchaseHistoryHome)
Router.post('/save', purchaseController.savePurchase);
Router.get('/getHistory', purchaseController.getPurchaseHistory)
module.exports = Router;