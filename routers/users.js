const express = require('express');
const Router = express.Router();
const UsersController = require('../controllers/users');
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
const LocalStrategy = require('../configs/passport-local-strategy');
Router.get('/login', UsersController.loginHome)
Router.get('/Admin', UsersController.adminHome)
Router.get('/getAllUsers', UsersController.getUsers);
Router.post('/changeStatus', UsersController.changeUserData);
Router.get('/profile', UsersController.getProfile);
Router.post('/updateProfile', UsersController.updateProfile);
Router.get('/changePasswordHome', UsersController.changePasswordHome);
Router.post('/updatePassword', UsersController.updatePassword)
Router.post('/authenticate', passport.authenticate(
    'local',
    {failureRedirect: '/user/login'},
), UsersController.createSession);
module.exports = Router;
Router.get('/', UsersController.loginHome)
Router.get('/logout', UsersController.logout)