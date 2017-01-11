// Load required packages
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var users = require('../../db/knexstore')('users');
var User = require('../../models/user');

const authenticateUser = (user, password) => {
    var instance = new User(user);
    return instance.authenticate(password);
};

module.exports = function(){
    passport.use(new BasicStrategy(
        function(email, password, done) {
            users.findOne({email})
            .then((user) => authenticateUser(user, password))
            .then((user) => {
                return done(null, user);
            }).catch(err=>{done(err);});
        }
    ));
};
