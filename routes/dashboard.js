const router = require('express').Router();

router.get('/', function(req, res, next) {
    if (!req.user) {
        res.redirect('/');
    } else {
        res.redirect('/dashboard.html');
    }
});

module.exports = router;