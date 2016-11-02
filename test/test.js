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
});
