var express = require('express');
var friendRouter = express.Router();


friendRouter.route('/')
    .get(function(req, res) {
        res.send('Hi Friends');
    });

friendRouter.route('/:id')
    .get(function(req, res) {
        res.send(req.params.id);
    });

module.exports = friendRouter;