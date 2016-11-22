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

router.use('/:id', function(req, res, next) {
    users.where({
        id: req.params.id
    }).first().then(function(user) {
        if (user) {
            req.user = user;
            next();
        }
        else {
            res.status(404).send('No user found');
        }
    }).catch(function(err) {
        next(err);
    });
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
    res.json(req.user);
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
    for (var k in req.user) {
        req.body[k] = req.body[k] ? req.body[k] : null;
    }

    delete req.body.id;

    users.update(req.user.id, req.body)
        .then(function(users) {
            res.status(200).json(users[0]);
        })
        .catch(function(error) {
            next(error);
        });
});

router.delete('/:id', function(req, res, next) {
    users.delete(req.user.id)
        .then(function() {
            res.status(200).json(req.user);
        })
        .catch(function(error) {
            next(error);
        });
});

router.patch('/:id', function(req, res, next) {
    if (req.body.id) {
        delete req.body.id;
    }
    for (var k in req.body) {
        req.user[k] = req.body[k];
    }
});

module.exports = router;
