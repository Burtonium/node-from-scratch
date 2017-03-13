'use strict';

// use this to debug 
// console.log(err.response.res.text);

process.env.NODE_ENV = 'test';

const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const app = require('../../app');

const users = require('../../db/knexstore')('users');
const clients = require('../../db/knexstore')('auth_clients');
const accessTokens = require('../../db/knexstore')('access_tokens');

const knex = require('../../db/knex');
const User = require('../../models/user');
const tokenPath = '/oauth/token/';
const usersPath = '/v1/users/';

chai.use(chaiHttp);

var testUser = {
    id: 1,
    email: "test@test.ca", 
    password: "Testme1"
};

var testClient = {
    id: 1,
    client_id: "test",
    secret: "testing"
};

var testAccessToken = {
    user_id: testUser.id,
    client_id: testClient.id,
    token: '614b3b6405492fde228f0373a4f6f06c742bd32c7f2731dbe2316ef189564fdf'
};

describe('Authorization Routes', function() {

    beforeEach(function(done) {
        knex.migrate.rollback()
            .then(function() { knex.migrate.latest()
            .then(function(users) { done(); }); })
            .catch(function(err) {
                console.log(err);
                done();
            });
    });

    afterEach(function(done) {
        knex.migrate.rollback()
            .then(function() {
                done();
            })
            .catch(function(err) {
                console.log(err);
                done();
            });
    });
    
    describe('POST ' + tokenPath + '', function(){
        it('should return a token', function(done){
            users.insert(new User(testUser))
            .then((user) => { clients.insert(testClient)
            .then((client) => {
                chai.request(app)
                    .post(tokenPath)
                    .send({
                        username: testUser.email,
                        password: testUser.password,
                        grant_type: 'password',
                        client_id: testClient.client_id,
                        client_secret: testClient.secret,
                        scope: '*'
                    })
                    .end((err, res) => {
                        expect(err).to.be.a('null');
                        res.body['0'].token.length.should.be.above(1);
                        done();
                    }); 
                });
            });
        });
    });
    
    describe('GET ' + usersPath + '', () => {
        it.skip('fails without the access token', (done) =>{
            chai.request(app)
                .get(usersPath)
                .end((err,res) => {
                    expect(err).to.not.be.a('null');
                    done();
                });
        });
        it('token gives access to the API', (done) => {
            users.insert(new User(testUser))
                .then((user) => {return clients.insert(testClient);  })
                .then((client) => {return accessTokens.insert(testAccessToken); })
                .then((accessToken) => {
                    chai.request(app)
                        .get(usersPath)
                        .set('Authorization', 'Bearer ' + testAccessToken.token)
                        .end((err, res) => {
                            expect(err).to.be.a('null');
                            res.body.users[0].email.should.equal(testUser.email);
                            done();
                        });
                }).catch((err) => {
                    console.log(err);
                    done();
                });
        });
    });
});