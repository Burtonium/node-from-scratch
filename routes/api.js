const routes = require('express').Router();
const users = require('./users');
const authorizations = require('./auth');
const dashboard = require('./dashboard');

routes.use('/users', users);
routes.use('/auth', authorizations);
routes.use('/dashboard', dashboard);

module.exports = routes;