const express = require('express');
const Router = express.Router();
const UsersController = require('../controllers/users');
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
const LocalStrategy = require('../configs/passport-local-strategy');
Router.get('/login', UsersController.loginHome)
Router.get('/Admin', passport.checkAuthentication, UsersController.adminHome)
Router.get('/getAllUsers', passport.checkAuthentication, UsersController.getUsers);
Router.post('/changeStatus', passport.checkAuthentication, UsersController.changeUserData);
Router.get('/profile', passport.checkAuthentication, UsersController.getProfile);
Router.post('/updateProfile', passport.checkAuthentication, UsersController.updateProfile);
Router.get('/changePasswordHome', passport.checkAuthentication, UsersController.changePasswordHome);
Router.post('/updatePassword', passport.checkAuthentication, UsersController.updatePassword);
Router.post('/addNew', passport.checkAuthentication, UsersController.addUser)
Router.post('/authenticate', passport.authenticate(
    'local',
    {failureRedirect: '/user/login'},
), UsersController.createSession);
module.exports = Router;
Router.get('/', UsersController.loginHome)
Router.get('/logout', UsersController.logout)