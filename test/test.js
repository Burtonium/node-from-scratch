'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const chaiHttp = require('chai-http');
const app = require('../app');
const knex = require('../db/knex');

chai.use(chaiHttp);

describe('API Routes', function() {

   beforeEach(function(done) {
      knex.migrate.rollback()
         .then(function() { knex.migrate.latest()
         .then(function() { return knex.seed.run()
         .then(function() { done(); }); }); });
   });
   
   afterEach(function(done) {
      knex.migrate.rollback()
         .then(function() { done(); });
   });

   describe('GET /api/v1/users', function() {
      it('should return all users', function(done) {
         chai.request(app)
            .get('/api/v1/users')
            .end(function(err, res) {
               expect(err).to.be.a('null');
               res.should.have.status(200);
               res.should.be.json; // jshint ignore:line
               res.body.should.be.a('array');
               res.body.length.should.equal(100);
               res.body[0].should.have.property('id');
               res.body[0].should.have.property('username');
               res.body[0].should.have.property('email');
               res.body[0].should.have.property('password');
               res.body[0].should.have.property('address');
               res.body[0].should.have.property('created');
               res.body[0].created.should.not.equal('');
               done();
            });
      });
   });

   describe('GET /api/v1/users/:id', function() {
      it('should return a single user', function(done) {
         chai.request(app)
         .get('/api/v1/users/1')
         .end(function(err, res) {
            expect(err).to.be.a('null');
            res.should.have.status(200);
            res.should.be.json; // jshint ignore:line
            res.body.should.be.a('object');
            res.body.should.have.property('id');
            res.body.should.have.property('username');
            res.body.should.have.property('email');
            res.body.should.have.property('password');
            res.body.should.have.property('address');
            res.body.should.have.property('created');
            res.body.created.should.not.equal('');
            done();
         });
      });
   });

   describe('POST /api/v1/users', function() {
      it('should add a user', function(done) {
         var user = {
            username: 'test_user',
            email: 'test@test.me',
            password: 'you shall not pass',
            address: 'No where street'
         };
         chai.request(app)
            .post('/api/v1/users')
            .send(user)
            .end(function(err, res) {
               expect(err).to.be.a('null');
               res.should.have.status(200);
               res.should.be.json; // jshint ignore:line
               res.body.should.be.a('object');
               res.body.should.have.property('id');
               res.body.id.should.equal(101);
               
               res.body.should.have.property('username');
               res.body.username.should.equal(user.username);
               
               res.body.should.have.property('email');
               res.body.email.should.equal(user.email);
               
               res.body.should.have.property('password');
               res.body.password.should.equal(user.password);
               
               res.body.should.have.property('address');
               res.body.address.should.equal(user.address);
               
               res.body.should.have.property('created');
               res.body.created.should.not.equal('');
               done();
            });
      });
   });

   describe('PUT /api/v1/users/:id', function() {
      it('should update a user', function(done) {
         var userId = 1;
         var user = {
            username: 'updated_user',
            email: 'updated@test.me',
            address: 'Updated address'
         };
         chai.request(app)
            .put('/api/v1/users/' + userId)
            .send(user)
            .end(function(err, res) {
               expect(err).to.be.a('null');
               res.body.should.have.property('id');
               res.body.id.should.equal(userId);
               
               res.body.should.have.property('username');
               res.body.username.should.equal(user.username);
               
               res.body.should.have.property('email');
               res.body.email.should.equal(user.email);
               
               res.body.should.have.property('address');
               res.body.address.should.equal(user.address);
               
               res.body.should.have.property('created');
               res.body.created.should.not.equal('');
               done();
            });
      });
   
      it('should not update the id', function(done) {
         chai.request(app)
            .put('/api/v1/users/1')
            .send({
               id: 20,
               username: 'suh',
               email: ''
            })
         .end(function(err, res) {
            expect(err).to.not.be.a('null');
            res.should.have.status(422);
            res.should.be.json; // jshint ignore:line
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            done();
         });
      });
   });
   
   describe('DELETE /api/v1/users/:id', function() {
      it('should delete a user', function(done) {
         var userId = 5;
         chai.request(app)
            .delete('/api/v1/users/' + userId)
            .end(function(error, response) {
               expect(error).to.be.a('null');
               response.should.have.status(200);
               response.should.be.json; // jshint ignore:line
               response.body.should.be.a('object');
               response.body.should.have.property('id');
               response.body.id.should.be.equal(userId);
               chai.request(app)
                  .get('/api/v1/users/' + userId)
                  .end(function(err, res) {
                     console.log(res);
                     res.should.have.status(404);
                  });
            });
      });
   });
});
