'use strict';

// use this to debug 
// console.log(err.response.res.text);

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
         .then(function() {
            knex.migrate.latest()
               .then(function() {
                  return knex.seed.run()
                     .then(function(users) {
                        done();
                     });
               });
         })
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

   describe('GET ' + path, function() {
      it('should return all users', function(done) {
         knex('users').select().then(function(expected) {
            chai.request(app)
               .get(path)
               .end(function(err, res) {
                  expect(err).to.be.a('null');
                  res.should.have.status(200);
                  res.should.be.json; // jshint ignore:line
                  res.body.should.have.property('users');
                  var users = res.body.users;
                  users.should.be.a('array');
                  users.length.should.equal(expected.length);
                  users[0].created.should.not.equal('');
                  done();
               });
         });
      });
   });

   describe('GET /api/v1/users/:id', function() {
      it('should return a single user', function(done) {
         knex('users').select().first().then(function(expected) {
            expected.created = expected.created.toISOString();
            chai.request(app)
               .get(path + expected.id)
               .end(function(err, res) {
                  expect(err).to.be.a('null');
                  res.should.have.status(200);
                  res.should.be.json; // jshint ignore:line
                  res.body.should.be.a('object');
                  res.body.should.have.property('user');
                  var user = res.body.user;
                  user.should.intersect(expected);
                  user.created.should.not.equal('');
                  done();
               });
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
               user.should.intersect(response);
               response.should.have.property('created');
               response.created.should.not.equal('');
               done();
            });
      });
   });

   describe('PUT /api/v1/users/:id', function() {
      it('should replace a user', function(done) {
         knex('users').select().first().then(function(expected) {
            var update = {
               email: 'updated@test.me',
               password: 'ayylmao'
            };

            chai.request(app)
               .put(path + expected.id)
               .send(update)
               .end(function(err, res) {
                  expect(err).to.be.a('null');
                  res.body.should.have.property('user');
                  expect(update).to.intersect(res.body.user);
                  expect(res.body.user.address).to.be.a('null');
                  res.body.user.should.have.property('created');
                  res.body.user.created.should.match.ISO8601; // jshint ignore:line

                  done();
               });
         });
      });

      it('should not update the id', function(done) {
         knex('users').select().first().then(function(expected) {
            chai.request(app)
               .put(path + expected.id)
               .send({
                  id: 29492,
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
                  user.id.should.equal(expected.id);
                  done();
               });
         });

      });
   });

   describe('DELETE ' + path + ':id', function() {
      it('should delete a user', function(done) {
         knex('users').select().first().then(function(expected) {
            chai.request(app)
               .delete(path + expected.id)
               .end(function(err, response) {
                  expect(err).to.be.a('null');
                  response.body.should.have.property('user');
                  response.should.have.status(200);
                  response.should.be.json; // jshint ignore:line

                  var user = response.body.user;
                  user.should.be.a('object');
                  user.should.have.property('id');
                  user.id.should.be.equal(expected.id);
                  chai.request(app)
                     .get(path + expected.id)
                     .end(function(err, res) {
                        expect(err).to.not.be.a('null');
                        res.should.have.status(404);
                        done();
                     });
               });
         });
      });
   });

   describe('PATCH /api/v1/users/:id', function() {
      it('should patch a user', function(done) {
         knex('users').select().first().then(function(expected) {
            var patch = {
               email: 'updated@test.me'
            };
            chai.request(app)
               .patch(path + expected.id)
               .send(patch)
               .end(function(err, res) {
                  expect(err).to.be.a('null');
                  res.body.should.have.property('user');
                  expect(patch).to.intersect(res.body.user);
                  done();
               });
         });

      });

   });
});
