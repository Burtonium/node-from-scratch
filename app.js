const https = require('https');
const fs = require('fs');
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const auth = require('./routes/auth');
const api = require('./routes/api');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');

app.use(helmet());

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'https://node-from-scratch-burtonium.c9users.io');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH, DELETE, OPTIONS');
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/', auth);
app.use('/', api);

app.get('/', function(req,res){
  res.send('Welcome to the Garago V2 api');
});


if (process.env.NODE_ENV === 'production') {
  const options = {    
    key: fs.readFileSync('keys/serverkey.pem'), 
    cert: fs.readFileSync('keys/servercert.pem'),
    ca: fs.readFileSync('keys/cacert.pem')
  };
  https.createServer(options, app).listen(port);
} 

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
