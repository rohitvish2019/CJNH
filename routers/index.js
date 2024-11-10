const express = require('express');
const Router = express.Router();
const passport = require('../configs/passport-local-strategy')
Router.use('/patients', require('./patients'));
Router.use('/sales', require('./sales'));
Router.use('/purchases', require('./purchases'));
Router.use('/reports', require('./reports'));
Router.use('/user', require('./users'))
Router.use('/',passport.checkAuthentication, require('./users'));
Router.use('/uploads', require('./uploads'));
Router.use('/meds', require('./meds'))
module.exports = Router;