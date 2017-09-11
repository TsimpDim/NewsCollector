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

app.get('/sources' , function(request,response){
    response.render('sources');
});

app.get('/all%20articles' , function(request,response){
    response.render('articles');
});
app.get('/redir' , function(request,response){
    response.redirect('/'+request.query['choice'])
    console.log('You should have been redirected to :'+ request.query['choice'])    
});



app.listen(app.get('port'),function(){
    console.log("Project is running on http://localhost:"+ app.get('port'));
});