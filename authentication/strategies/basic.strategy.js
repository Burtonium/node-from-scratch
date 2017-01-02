// Load required packages
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var clients = require('../../db/knexstore')('clients');

const verifyClient = (client, password) => {
    return Promise(function(resolve, reject) {
        if (client.secret === password) {
            resolve(client);
        } else {
            reject('Client not authenticated');
        }
    });
};

module.exports = function(){
    passport.use(new BasicStrategy(
        function(email, password, done) {
            clients.findOne({
                client_id: email
            })
            .then((client) => verifyClient(client, password))
            .then(function(client){
                return done(null, client);
            }).catch(err=>{done(err);});
        }
    ));
};
