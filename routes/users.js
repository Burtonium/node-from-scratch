const router = require('express').Router();
const users = require('../db/queries/users');

router.use(function(req, res, next) {
    if (!req.user && process.env.NODE_ENV != 'test') {
        res.redirect('/');
    }
    else {
        next();
    }
});

router.get('/', function(req, res, next) {
    users.get()
        .then(function(users) {
            res.status(200).json(users);
        })
        .catch(function(error) {
            next(error);
        });
});

router.get('/:id', function(req, res, next) {
    users.where({
            id: req.params.id
        }).first()
        .then(function(user) {
            if (user) {
                res.status(200).json(user);
            }
            else {
                res.sendStatus(404);
            }
        })
        .catch(function(error) {
            next(error);
        });
});

router.post('/', function(req, res, next) {
    users.insert(req.body)
        .then(function(id) {
            return users.where({
                id: id[0]
            }).first();
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
    users.update(req.params.id, req.body)
        .then(function() {
            return users.where({
                id: req.params.id
            }).first();
        })
        .then(function(show) {
            res.status(200).json(show);
        })
        .catch(function(error) {
            next(error);
        });
});

router.delete('/:id', function(req, res, next) {
    users.where({
            id: req.params.id
        }).first()
        .then(function(user) {
            users.delete(req.params.id)
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
