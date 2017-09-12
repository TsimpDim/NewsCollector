let express = require('express')
let handlebars = require('express-handlebars').create({defaultLayout:'main'});
let request = require('request');
let NewsAPI = require('newsapi');

let app = express();
let newsapi = new NewsAPI('14e9cb737cc34f0aaa2265807c1be172');

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

    //Get sources
    newsapi.sources({
        language: 'en'
      }).then(sourcesResponse => {
        let sources = JSON.parse(JSON.stringify(sourcesResponse));
        
        for(let i = 0; i < sources['sources'].length; i++){
            console.log(sources['sources'][i]['name']);
        }
    });




});

app.get('/all%20articles' , function(request,response){
    response.render('articles');

    
    newsapi.articles({
        source: 'associated-press', // required 
        sortBy: 'top' // optional 
      }).then(articlesResponse => {
        console.log(articlesResponse);
      });

});
app.get('/redir' , function(request,response){
    response.redirect('/'+request.query['choice'])
    console.log('You should have been redirected to :'+ request.query['choice'])    
});



app.listen(app.get('port'),function(){
    console.log("Project is running on http://localhost:"+ app.get('port'));
});