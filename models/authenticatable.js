'use strict';

const assert = require('assert');
const bcrypt = require('bcrypt');
const saltRounds = 10;

class Authenticatable {
    constructor() {}

    hash(password, callback) {
        bcrypt.hash(password, saltRounds, function(err, hash) {
            assert(!err, 'Encryption failure');
            callback(hash);
        });
    }

    hashSync(password) {
        return bcrypt.hashSync(password, saltRounds);
    }

    authenticate(password) {
        var self = this;
        return new Promise( function(resolve, reject) {
            bcrypt.compare(password, self.hashed_password, function(err, res){
                if (err) {
                    throw new Error(err);
                }
                if (!res) {
                    reject('Password mismatch');
                } else {
                    resolve(self);
                }
            });
        });
    }
    
    get password() {
        throw new Error("Cannot get password.");
    }
    
    set password(pass){
        if(pass){ 
            this.hashed_password = this.hashSync(pass);
        }
    }
}

module.exports = Authenticatable;
