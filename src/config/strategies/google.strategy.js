const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const users = require('../../../db/queries/users');

module.exports = function() {
    passport.use(new GoogleStrategy({
            clientId: '',
            clientSecret: '',
            callbackURL: '',
            function(req, accessToken, refreshToken, profile, done) {
                
            }
        }));
};
