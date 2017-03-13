// Load required packages
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var users = require('../../db/knexstore')('users');
var User = require('../../models/user');

const authenticateUser = (user, password) => {
    if (!user) { throw new Error('User not found'); }
    var instance = new User(user);
    return instance.authenticate(password);
};

module.exports = () => {
    passport.use(new BasicStrategy(
        (email, password, done) => {
            users.findOne({email})
            .then((user) => authenticateUser(user, password))
            .then((user) => {
                return done(null, user);
            }).catch((err) => {done(err);});
        }
    ));
};
