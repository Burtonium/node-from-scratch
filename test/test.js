'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const chaiHttp = require('chai-http');
const app = require('../app');
const knex = require('../db/knex');
const path = '/api/v1/users/';
require('./helpers/helpers')(chai);
chai.use(chaiHttp);

describe('API Routes', function() {
   
   beforeEach(function(done) {
      knex.migrate.rollback()
         .then(function() { knex.migrate.latest()
         .then(function() { return knex.seed.run()
         .then(function() { done(); }); }); })
         .catch(function(err){console.log(err); done();});
   });
   
   afterEach(function(done) {
      knex.migrate.rollback()
         .then(function() { done(); })
         .catch(function(err){console.log(err); done();});
   });

   describe('GET ' + path, function() {
      it('should return all users', function(done) {
         chai.request(app)
            .get(path)
            .end(function(err, res) {
               expect(err).to.be.a('null');
               res.should.have.status(200);
               res.should.be.json; // jshint ignore:line
               res.body.should.have.property('users');
               var users = res.body.users;
               users.should.be.a('array');
               users.length.should.equal(100);
               users[0].should.have.property('id');
               users[0].should.have.property('email');
               users[0].should.have.property('password');
               users[0].should.have.property('address');
               users[0].should.have.property('created');
               users[0].created.should.not.equal('');
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
            res.body.should.have.property('user');
            var user = res.body.user;
            user.should.have.property('id');
            user.should.have.property('email');
            user.should.have.property('password');
            user.should.have.property('address');
            user.should.have.property('created');
            user.created.should.not.equal('');
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
               res.body.should.have.property('user');
               var response = res.body.user;
               response.should.have.property('id');
               response.id.should.equal(101);
               user.should.intersect(response);
               response.should.have.property('created');
               response.created.should.not.equal('');
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
               res.body.should.have.property('user');
               expect(user).to.intersect(res.body.user);
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
            res.body.should.have.property('user');
            var user = res.body.user;
            user.should.be.a('object');
            user.should.have.property('id');
            user.id.should.equal(userId);
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
               response.body.should.have.property('user');
               response.should.have.status(200);
               response.should.be.json; // jshint ignore:line
               
               var user = response.body.user;
               user.should.be.a('object');
               user.should.have.property('id');
               user.id.should.be.equal(userId);
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
   
    describe('PATCH /api/v1/users/:id', function() {
      it('should patch a user', function(done) {
         var userId = 1;
         var user = {
            email: 'updated@test.me'
         };
         chai.request(app)
            .patch(path + userId)
            .send(user)
            .end(function(err, res) {
               expect(err).to.be.a('null');
               res.body.should.have.property('user');
               expect(user).to.intersect(res.body.user);
               done();
            });
      });
   
   });
});
