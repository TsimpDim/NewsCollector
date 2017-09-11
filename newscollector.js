let express = require('express')
let handlebars = require('express-handlebars').create({defaultLayout:'main'});

let app = express();
app.engine('handlebars',handlebars.engine);


app.disable('x-powered-by');
app.set('view engine','handlebars');
app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname +'/public'));

app.get('/' , function(request,response){
    response.render('home');
});
app.get('/redir' , function(request,response){
    response.send('You should have been redirected to :'+ request.query['choice'])    
});

app.get('/about' , function(request,response){
    response.render('about');
});



app.listen(app.get('port'),function(){
    console.log("Project is running on http://localhost:"+ app.get('port'));
});