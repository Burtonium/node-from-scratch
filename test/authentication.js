'use strict';

// use this to debug 
// console.log(err.response.res.text);

process.env.NODE_ENV = 'test';

const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const app = require('../app');
const knex = require('../db/knex');
const users = require('../db/knexstore')('users');
const User = require('../models/user');
const tokenPath = '/oauth/token';

// var testUser = {};
// describe.only('Authorization Routes', function() {
//     before(function(){
//         testUser = new User({email: "test@test.ca", password: "Testme1"});
//         users.insert(testUser);
//     });
//     describe('GET ' + tokenPath + '', function(){
//         it('should return a token', function(done){
//           done(); 
//         });
//     });
// });