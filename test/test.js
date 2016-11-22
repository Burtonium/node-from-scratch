'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const chaiHttp = require('chai-http');
const app = require('../app');
const knex = require('../db/knex');
const path = '/users/';
require('./helpers/helpers')(chai);
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

   describe('GET ' + path, function() {
      it('should return all users', function(done) {
         chai.request(app)
            .get(path)
            .end(function(err, res) {
               expect(err).to.be.a('null');
               res.should.have.status(200);
               res.should.be.json; // jshint ignore:line
               res.body.should.be.a('array');
               res.body.length.should.equal(100);
               res.body[0].should.have.property('id');
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
         .get(path + '/1')
         .end(function(err, res) {
            expect(err).to.be.a('null');
            res.should.have.status(200);
            res.should.be.json; // jshint ignore:line
            res.body.should.be.a('object');
            res.body.should.have.property('id');
            res.body.should.have.property('email');
            res.body.should.have.property('password');
            res.body.should.have.property('address');
            res.body.should.have.property('created');
            res.body.created.should.not.equal('');
            done();
         });
      });
   });

   describe('POST ' + path, function() {
      it('should add a user', function(done) {
         var user = {
            email: 'test@test.me',
            password: 'you shall not pass',
            address: 'No where street'
         };
         chai.request(app)
            .post(path)
            .send(user)
            .end(function(err, res) {
               expect(err).to.be.a('null');
               res.should.have.status(200);
               res.should.be.json; // jshint ignore:line
               res.body.should.be.a('object');
               res.body.should.have.property('id');
               res.body.id.should.equal(101);
               
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
            email: 'updated@test.me',
            password: 'ayylmao',
            address: 'Updated'
         };
         chai.request(app)
            .put(path + userId)
            .send(user)
            .end(function(err, res) {
               expect(err).to.be.a('null');
               expect(user).to.intersect(res.body);
               done();
            });
      });
   
      it('should not update the id', function(done) {
         var userId = 1;
         chai.request(app)
            .put(path + userId)
            .send({
               id: 20,
               email: 'also not nullable',
               password: 'not nullable'
            })
         .end(function(err, res) {
            expect(err).to.be.a('null');
            res.should.have.status(200);
            res.should.be.json; // jshint ignore:line
            res.body.should.be.a('object');
            res.body.should.have.property('id');
            res.body.id.should.equal(userId);
            done();
         });
      });
   });
   
   describe('DELETE ' + path + ':id', function() {
      it('should delete a user', function(done) {
         var userId = 5;
         chai.request(app)
            .delete(path + userId)
            .end(function(err, response) {
               expect(err).to.be.a('null');
               response.should.have.status(200);
               response.should.be.json; // jshint ignore:line
               response.body.should.be.a('object');
               response.body.should.have.property('id');
               response.body.id.should.be.equal(userId);
               chai.request(app)
                  .get(path + userId)
                  .end(function(err, res) {
                     expect(err).to.not.be.a('null');
                     res.should.have.status(404);
                     done();
                  });
            });
      });
   });
});
