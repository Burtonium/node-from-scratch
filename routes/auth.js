const router = require('express').Router();
const oauth2 = require('../authentication/oauth2');

module.exports =  (passport) => {
    router.post('/oauth/token', oauth2.token);
    
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
    return router;
};
