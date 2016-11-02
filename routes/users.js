const router = require('express').Router();

router.get('/', function(req, res) {
    res.send('hello world');
});

router.get('/:id', function(req, res) {
    res.send(req.params.id);
});

module.exports = router;
