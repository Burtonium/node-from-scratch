var express = require('express');

var app = express();
var port = process.env.PORT |

app.use(express.static('public'));
app.use(express.static('src/views'));

if(!module.parent){
    app.listen(port, function(err){
        if(err){
            
        }
        console.log('running server on port ' + port);
    });
}
