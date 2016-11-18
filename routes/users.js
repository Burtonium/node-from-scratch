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
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404);
            }
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

router.put('/:id', function(req, res, next) {
    if (req.body.hasOwnProperty('id')) {
        return res.status(422).json({
            error: 'You cannot update the id field'
        });
    }
    queries.updateUser(req.params.id, req.body)
        .then(function() {
            return queries.getUser(req.params.id);
        })
        .then(function(show) {
            res.status(200).json(show);
        })
        .catch(function(error) {
            next(error);
        });
});

router.delete('/:id', function(req, res, next) {
    queries.getUser(req.params.id)
        .then(function(user) {
            queries.deleteUser(req.params.id)
                .then(function() {
                    res.status(200).json(user);
                })
                .catch(function(error) {
                    next(error);
                });
        }).catch(function(error) {
            next(error);
        });
});

module.exports = router;
