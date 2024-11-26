const express = require('express');
const Router = express.Router();
const purchaseController = require('../controllers/purchases');
const passport = require('../configs/passport-local-strategy')
Router.get('/home', passport.checkAuthentication, purchaseController.home);
Router.get('/history', passport.checkAuthentication, purchaseController.purchaseHistoryHome)
Router.post('/save', passport.checkAuthentication, purchaseController.savePurchase);
Router.get('/getHistory',passport.checkAuthentication, purchaseController.getPurchaseHistory);
Router.post('/cancel/:id', passport.checkAuthentication, purchaseController.cancelPurchases)
module.exports = Router;