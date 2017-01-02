const oauth2orize = require('oauth2orize');
const crypto = require('crypto');
const passport = require('passport');
const User = require('../models/user');
const users = require('../db/knexstore')('users');
const refreshTokens = require('../db/knexstore')('refresh_tokens');
const accessTokens = require('../db/knexstore')('access_tokens');
const tokenLife = 3600;

var server = oauth2orize.createServer();

function generateToken(user, client) {
    return { 
        token: crypto.randomBytes(32).toString('hex'), 
        client_id: client.id, 
        user_id: user.id 
    };
}

const authenticateUser = (user, password) => {
    try {
        return User(user).authenticate(password);
    }
    catch (e) {
        return Promise.reject(e);
    }
};

const deleteExistingTokens = (user, client) => { 
    var access = accessTokens.deleteWhere({client_id: client.id, 
                                           user_id: user.id});
    var refresh = refreshTokens.deleteWhere({client_id: client.id,
                                             user_id: user.id});
    return Promise.all([access, refresh])
        .then(() => {return user;});
};

const createAndSaveNewTokens = (user, client) => { 
    var access = accessTokens.insert(generateToken(user, client));
    var refresh = refreshTokens.insert(generateToken(user, client));
    return Promise.all([access, refresh]);
};

server.exchange(oauth2orize.exchange.password(
    function(client, email, password, scope, done) {
        users.findOne({email: email})
            .then(user => authenticateUser(user, password)) 
            .then(user => deleteExistingTokens(user, client)) 
            .then(user => createAndSaveNewTokens(user, client)) 
            .then(function(results){
                done(null, results[0], results[1], {'expires_in': tokenLife});
            }).catch(err => {done(err);});
    }));

server.exchange(oauth2orize.exchange.refreshToken(
    function(client, refreshToken, scope, done) {
        refreshTokens.findOne({ token: refreshToken })
            .then(token => users.findOne({id: token.user_id}))
            .then(user => deleteExistingTokens(user, client))
            .then(user => createAndSaveNewTokens(user, client))
            .then(function(results){
                done(null, results[0], results[1], {'expires_in': tokenLife});
            }).catch(err => {done(err);});
}));

exports.token = [
    passport.authenticate(['basic', 'oauth2-client-password'], {session: false}),
    server.token(),
    server.errorHandler()
];