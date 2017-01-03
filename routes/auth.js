const router = require('express').Router();
const app = require('express')();
const passport = require('../authentication/passport')(app);
const oauth2 = require('../lib/oauth2');

router.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/dashboard',
    failure: '/'
}));

router.get('/google', passport.authenticate('google', {
    scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
    ]
}));

router.post('/oauth/token', oauth2.token);

module.exports =  router;
