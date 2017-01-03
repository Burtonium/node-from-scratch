'use strict';
const assert = require('assert');
const Authenticatable = require('./authenticatable');

class User extends Authenticatable {
    constructor(args) {
        super();
        
        this.assign(args, 'id');
        this.assign(args, 'hashed_password');
        this.assign(args, 'email');
        this.assign(args, 'address');
        this.assign(args, 'created');
        
        this.password = args.password;
    }
    
    get valid() {
        return this.hashed_password && this.email;
    }
    
    assign(collection, arg) {
        if (collection[arg] !== undefined) {
            this[arg] = collection[arg];
        }
    }
    
    get password() {
        throw new Error("Use authenticate instead.");
    }
    
    set password(pass) {
        super.password = pass;
    }
}

module.exports = User;
