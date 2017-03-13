const express = require('express');
const app = express();
const passport = require('./authentication/passport')(app);
const auth = require('./routes/auth')(passport);
const api = require('./routes/api')(passport);
const port = process.env.PORT || 8080;
const bodyParser = require('body-parser');
const morgan = require('morgan');
const version = require('./package.json').version;

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'https://vue-frontend-burtonium.c9users.io');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH, DELETE, OPTIONS');
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/', auth);
app.use('/v1', api);

app.get('/v1', function(req,res){
  res.send('Welcome to the Garago V2 API v' + version);
});


if (!module.parent) {
    app.listen(port, function(err) {
      if (err) {
        console.log(err);
      }
      console.log('running server on port ' + port);
    });
}

// dev error handler
if (process.env.NODE_ENV === 'test' ||
  process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// production error handler
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.json({
//     message: err.message,
//     error: {}
//   });
// });

module.exports = app;
