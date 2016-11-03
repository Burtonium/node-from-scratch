const routes = require('express').Router();
const users = require('./users');
const authorizations = require('./auth');

routes.use('/users', users);
routes.use('/auth', authorizations);

module.exports = routes;