var express = require('express')

var app = express();

app.set('port', process.env.PORT || 3000);

app.get('/' , function(request,response){
    response.send('Everything is ok');
});

app.listen(app.get('port'),function(){
    console.log("Project is running");
});