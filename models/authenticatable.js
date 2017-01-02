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
            self.hash(password, function(hash) {
                if (hash == self._hash) {
                    resolve(self); 
                } else {
                    reject('Password mismatch');
                }
            });
        });
    }
}

module.exports = Authenticatable;
