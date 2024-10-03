const express = require('express');
const Router = express.Router();

Router.use('/patients', require('./patients'));
module.exports = Router;