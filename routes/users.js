const router = require('express').Router();
const queries = require('../db/queries/users');

router.get('/', function(req, res, next) {
    queries.getAllUsers()
        .then(function(users) {
            res.status(200).json(users);
        })
        .catch(function(error) {
            next(error);
        });
});

router.get('/:id', function(req, res, next) {
    queries.getUser(req.params.id)
        .then(function(user) {
            res.status(200).json(user);
        })
        .catch(function(error) {
            next(error);
        });
});

router.post('/', function(req, res, next) {
    queries.insertUser(req.body)
        .then(function(id) {
            return queries.getUser(id);
        })
        .then(function(user) {
            res.status(200).json(user);
        })
        .catch(function(err) {
            next(err);
        });
});

module.exports = router;
