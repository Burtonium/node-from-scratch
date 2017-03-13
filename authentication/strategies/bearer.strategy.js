var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
const accessTokens = require('../../db/knexstore')('access_tokens');
const users = require('../../db/knexstore')('users');
const tokenLife = require('../../config').tokenLife;

const verifyToken = (token) => {
    if (!token) {
        return Promise.reject('Token not found');
    }
    return new Promise((resolve, reject) => {
        if (Math.round((Date.now() - token.created) / 1000) > tokenLife) {
            tokenLife.deleteWhere({
                id: token.id
            }).then(function() {
                reject('Token expired');
            });
        } else {
            resolve(token);
        }
    });
};

const findUser = (token) => {
    return users.findOne({
        id: token.user_id
    });
};

module.exports = () => {
    passport.use('bearer', new BearerStrategy(
        (accessToken, done) => {
            accessTokens.findOne({token: accessToken})
                .then(verifyToken)
                .then(findUser)
                .then((user) => {
                    done(null, user);
                }).catch((err) => {
                    done(null, false, err);
                });
        }));
};
