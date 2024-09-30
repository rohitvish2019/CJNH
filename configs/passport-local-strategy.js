const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/Users');


// authentication using passport
passport.use(new LocalStrategy({
    usernameField: 'email'
    },
    async function(email, password, done){
        console.log('Authenticating the user')
        try{
            let user = await User.findOne({email: email});
            if (!user || user.password != password){
                console.log('Invalid Username/Password');
                return done(null, false);
            }else{
                return done(null, user);
            }
        }catch(err){
            console.log('Error in finding user --> Passport');
            return done(err)
        }
    }
));



// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});



// deserializing the user from the key in the cookies
passport.deserializeUser(async function(id, done){
    try{
        let user = await User.findById(id);
        return done(null, user);
    }catch(err){
        console.log('Error in finding user --> Passport');
        return done(err);
        }
    });



passport.checkAuthentication = function (request, response, next){
    if(request.isAuthenticated()){
        return next();
    }
    else{
        return response.redirect('/user/login');
    }
}

passport.setAuthenticatedUser = function(request, response, next){
    if(request.isAuthenticated()){
        response.locals.user = request.user.id;
    }

    next();
}

module.exports = passport;