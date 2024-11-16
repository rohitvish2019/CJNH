const express = require('express');
const Router = express.Router();
const medController = require('../controllers/meds');
const passport = require('../configs/passport-local-strategy')
Router.get('/getAll', passport.checkAuthentication, medController.getAllMedicine);
Router.post('/addNew', passport.checkAuthentication, medController.addMeds)
Router.delete('/deleteMedicine/:medId', passport.checkAuthentication, medController.deleteMedicine)
module.exports = Router;