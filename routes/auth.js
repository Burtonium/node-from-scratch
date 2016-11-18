const router = require('express').Router();
const queries = require('../db/queries/auth');

router.post('/', function(req, res) {
    if (req.body.action) {
        console.log(req.body);
    }
    res.status(200).send('ok');
});

module.exports = router;
