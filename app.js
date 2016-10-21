var express = require('express');

var app = express();
var port = process.env.PORT || 8080;
var friendRouter = require('./src/routes/friendRoutes');

app.use(express.static('public'));
app.use(express.static('src/views'));

if (!module.parent) {
    app.listen(port, function(err) {
        if (err) {

        }
        console.log('running server on port ' + port);
    });
}


app.use('/Friends', friendRouter);


app.get('/', function(req, res) {
    res.render('index', {
        title: 'Burtonize me',
        nav: [{
            Link: '/Friends',
            Text: 'Friends'
        }, {
            Link: 'Profile',
            Text: 'Profile'
        }]
    });
});
