'use strict';

const Authenticatable = require('./authenticatable');

class User extends Authenticatable {
    constructor(args) {
        super();
        
        this.assign(args, 'id');
        this.assign(args, 'hashed_password');
        this.assign(args, 'email');
        this.assign(args, 'address');
        this.assign(args, 'created');
        
        super.password = args.password;
    }
    
    valid() {
        return this.hashed_password !== undefined &&
               typeof this.email === 'string' &&
               this.email.length;
    }
    
    assign(collection, arg) {
        if (collection[arg] !== undefined) {
            this[arg] = collection[arg];
        }
    }
}

module.exports = User;
