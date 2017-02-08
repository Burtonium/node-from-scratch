'use strict';

// use this to debug 
// console.log(err.response.res.text);

process.env.NODE_ENV = 'test';

const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const app = require('../../app');
const users = require('../../db/knexstore')('users');
const User = require('../../models/user');
const tokenPath = '/v1/oauth/token/';

var testUser = {email: "test@test.ca", password: "Testme1"};
describe.skip('Authorization Routes', function() {
    before(function(){
        users.insert(new User(testUser));
    });
    describe('GET ' + tokenPath + '', function(){
        it('should return a token', function(done){
          chai.request(app)
          .get(tokenPath)
          .auth(testUser.email, testUser.password)
          .end((err, res) => {
              expect(err).to.be.a('null');
          });
        });
    });
});