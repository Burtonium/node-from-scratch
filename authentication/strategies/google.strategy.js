const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const users = require('../../db/knexstore')('users');

module.exports = function() {
    passport.use(new GoogleStrategy({
            clientID: '624538343935-k927qdqn6njg2v3c86rlcags7hlcicj4.apps.googleusercontent.com',
            clientSecret: 'hz8Jqsz12eF7EKEfOyW5KPQv',
            callbackURL: 'http://node-from-scratch-burtonium.c9users.io/auth/google/callback'
        },
        function(req, accessToken, refreshToken, profile, done) {
            
            var user = {
                email: profile.emails[0].value,
                password: '',
                google: {
                    id: profile.id,
                    token: accessToken
                }
            };
            var promise = users.findOrCreate(user);
            promise.then(function(user){
                if (user) {
                    done(null, user);
                }
            });
            return done(null, user);
        }
    ));
};
