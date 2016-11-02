const routes = require('express').Router();
const users = require('./users');

routes.use('/users', users);

module.exports = routes;