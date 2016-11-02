const router = require('express').Router();
const queries = require('../db/queries');

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
    queries.getSingleUser(req.params.id)
    .then(function(user) {
        res.status(200).json(user);
    })
    .catch(function(error) {
        next(error);
    });
});

module.exports = router;
