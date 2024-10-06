const express = require('express');
const Router = express.Router();

Router.use('/patients', require('./patients'));
Router.use('/sales', require('./sales'));
Router.use('/purchases', require('./purchases'))
module.exports = Router;