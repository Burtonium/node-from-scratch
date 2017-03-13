const router = require('express').Router();
const users = require('../../db/knexstore')('users');
const User = require('../../models/user');
const passport = require('passport');


// TODO make this const
var authenticate = [passport.authenticate(['bearer'], {session: false}), (req, res, next) => {
    console.log(process.env.NODE_ENV);
    if (req.isAuthenticated()) { 
        return next(null);
    }
    else {
        return res.status(401).send('Unauthorized suh dude');
    }
}];

// TODO please remove me and override me somehow in testing
if (process.env.NODE_ENV === 'test') {
    authenticate = (req, res, next) => {
        return next(null);
    };
}


router.use('/:id', authenticate, function(req, res, next) {
    users.findWhere({
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

router.get('/', authenticate, function(req, res, next) {
    users.findAll()
        .then(function(users) {
            res.status(200).json({ users: users} );
        })
        .catch(function(error) {
            next(error);
        });
});

router.get('/:id', authenticate, function(req, res, next) {
    res.json({user: req.user});
});

router.post('/', function(req, res, next) {
    let args = req.body.user || req.body;
    let user = new User(args);
    
    if(!user.valid()) {
        res.status(400).send(user.errors || 'Invalid User');
    }
    
    users.findOne({email: user.email})
        .then((found) => {
            if (found){
                res.status(409).send('User exists');
                return Promise.reject();
            } else {
                return users.insert(user);
            }
        })
        .then((insertedRecords) => {
            let user = insertedRecords[0];
            delete user.hashed_password;
            res.status(201).json({user: user});
        })
        .catch((err) => {
            next(err);
        });
});

router.put('/:id', authenticate, function(req, res, next) {
    delete req.user.created;
    
    // nullify missing fields
    for (var k in req.user) {
        req.body[k] = req.body[k] ? req.body[k] : null;
    }
    
    req.body.id = req.user.id;
    
    let user = new User(req.body);
    if(!user.valid()) {
        res.status(404).send('Invalid user');
    }
    
    users.update(user)
        .then(function(updatedRecords) {
            let user = updatedRecords[0];
            delete user.hashed_password;
            res.status(200).json({user: user});
        })
        .catch(function(error) {
            next(error);
        });
});

router.delete('/:id', authenticate, function(req, res, next) {
    users.deleteWhere({id: req.user.id})
        .then(function() {
            res.status(200).json({user: req.user});
        })
        .catch(function(error) {
            next(error);
        });
});

router.patch('/:id', authenticate, function(req, res, next) {

    // can't patch these
    req.body.id = req.user.id;
    delete req.body.created;

    users.update(new User(req.body))
        .then(function(users) {
            res.status(200).json({user: users[0]});
        }).catch(function(err) {
            next(err);
        });
});

module.exports = router;
