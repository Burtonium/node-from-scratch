'use strict';

// use this to debug 
// console.log(err.response.res.text);

process.env.NODE_ENV = 'test';

const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const app = require('../app');
const knex = require('../db/knex');
const tokenPath = '/oauth/token';


// describe.only('Authorization Routes', function() {
    

// });