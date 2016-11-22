const router = require('express').Router();
const queries = require('../db/queries/users');
const passport = require('passport');

router.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/dashboard/',
    failure: '/'
}));

router.get('/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
    ]
}));

router.post('', function(req, res, next) {
    if (req.body.action && req.body.user) {
        if (req.body.action === 'login') {
            passport.authenticate('local', function(err, user) {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.redirect('/');
                }
                req.logIn(user, function(err) {
                    if (err) {
                        return next(err);
                    }
                    return res.redirect('/dashboard');
                });
            })(req, res, next);
        }
        else if (req.body.action === 'signup') {
            queries.insert(req.body.user)
                .then(function(id) {
                    req.logIn(req.body.user, function() {
                        res.redirect('/users/' + id);
                    });
                }).catch(function(err) {
                    next(err);
                });
        }
    }
    else {
        res.status(500).send('not ok');
    }
});

module.exports = router;
