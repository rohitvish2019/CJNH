const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
//const expressLayouts = require('express')
const mongoose = require('mongoose');
const db = require('./configs/dbConnection');
let propertiesReader = require('properties-reader');
const session = require('express-session');
const properties = propertiesReader('./configs/database.properties')
const passport = require('passport');
const passportLocal = require('./configs/passport-local-strategy');
const ejs = require('ejs');
const MongoStore = require('connect-mongo')


//const { request, urlencoded } = require('express');
const port = 4000;

//const flash = require('connect-flash');
//const customMiddleWare = require('./config/middleware');
let session_db_name = properties.get('session_db_name');
let session_seceret_key = properties.get('session_key');
let db_url = properties.get('url')
app.use(cookieParser());


app.set('view engine', 'ejs');
app.set('views','./views');

app.use(express.urlencoded({extended:true}));

app.use(express.static('./assets'));
//app.use(cookieParser());

/*
app.use(expressLayouts);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);
*/


app.use(session({
    name: session_db_name,
    // TODO change the secret before deployment in production mode
    secret: session_seceret_key,
    saveUninitialized: false,
    resave: false,
    rolling:true,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store:MongoStore.create(
        {
            mongoUrl: db_url+session_db_name,
            autoRemove: 'disabled',
            rolling:true
        
        },
        function(err){
            console.log(err ||  'connect-mongodb setup ok');
        }
    )
}));

//app.use(flash());
//app.use(customMiddleWare.setFlash);


app.use(passport.initialize());
app.use(passport.session());
app.use(passportLocal.setAuthenticatedUser);



app.use('/', require('./routers/index'));

app.listen(port, function(err){
    if(err){
        console.log("Error starting server");
        return;
    }
    console.log("Server started on port "+port);
});
