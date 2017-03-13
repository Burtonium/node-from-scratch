module.exports = (passport) => {
    const routes = require('express').Router();
    const users = require('./api/users');
    const dashboard = require('./api/dashboard');
    routes.use('/users', users);
    routes.use('/dashboard', dashboard);
    return routes;
};