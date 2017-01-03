const passport = require('passport');

module.exports = function(app) {
    app.use(passport.initialize());

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    require('./strategies/basic.strategy')();
    require('./strategies/bearer.strategy')();
    require('./strategies/clientpassword.strategy')();
    require('./strategies/google.strategy')();
    
    
    return passport;
};
