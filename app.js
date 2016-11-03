var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var api = require('./routes/api');
const bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(express.static('public/views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use('/api/v1/', api);

if (!module.parent) {
    app.listen(port, function(err) {
        if (err) {

        }
        console.log('running server on port ' + port);
    });
}

// development error handler
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});

module.exports = app;