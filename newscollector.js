let express = require('express');
let handlebars = require('express-handlebars').create(
    {
        defaultLayout:'main',
        helpers: {
            title: function(object,n){
                if(object == undefined || object[n] == undefined){
                    return "<ARTICLE NOT FOUND>";
                }


                return object[n]['title'];
            },
            image: function(object,n){
                if(object == undefined || object[n] == undefined){
                    return "";
                }

                return object[n]['urlToImage'];
            },
            desc: function(object,n){
                if(object == undefined || object[n] == undefined || object[n]['description'] == null){
                    return "No description available";
                }

                return object[n]['description'];
            },
            author: function(object,n){
                if(object == undefined || object[n] == undefined || object[n]['author'] == null){
                    return "";
                }

                return object[n]['author'];
            },
            link: function(object,n){
                if(object == undefined || object[n] == undefined){
                    return "";
                }

                return object[n]['url'];
            },
            date: function(object,n){
                if(object == undefined || object[n] == undefined || object[n]['publishedAt'] == null){
                    return "";
                }

                return object[n]['publishedAt'].replace(/\T(.*)/g,'');
            },
            times: function(n,block){
                let accum = '';
                for(let i = 0; i < n; ++i){
                    accum += block.fn(i);
                }
                return accum;
            }
        }
    }
);

let NewsAPI = require('newsapi');
let helperFunctions = require('./helperFunctions');

let app = express();
let newsapi = new NewsAPI('14e9cb737cc34f0aaa2265807c1be172');

app.engine('handlebars',handlebars.engine);
app.disable('x-powered-by');

app.set('view engine','handlebars');
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname +'/public'));

app.listen(app.get('port'),function(){
    console.log("Project is running on http://localhost:"+ app.get('port'));
});

app.get('/' , function(request,response){
    response.redirect('/sources');
});

app.get('/sources' , function(request,response){

    // Get sources
    helperFunctions.getSources(newsapi, function(val){
        response.render('sources',{'sources_list':val});
    });

});

app.get('/allarticles' , function(request,response){

    // Get sources
    sources_list = helperFunctions.getSources(newsapi);

    // Get articles from sources
    res = helperFunctions.getArticles(newsapi);

    response.render('articles',{'articles':res.values, 'amount': res.amount});
});

app.get('/articles' , function(request,response){
    let source_list = request.query['sources'].split(',');


    if(source_list == 'none'){
        response.redirect('/Sources');
    }else{

        // Get articles from sources
        helperFunctions.getArticles(newsapi, function(val){
            response.render('articles',{'articles':val.values, 'amount': val.amount});
        });

    }
});

app.use(function(req, res){
    res.status(404);

    //Respond with html page
    if (req.accepts('html')) {
      res.render('error', {ErrorCode:404,ErrorDesc:"The page you requested was not found...oops" });
      return;
    }


    //Default to plain-text. send()
    res.type('txt').send('404 Not Found');
});

app.use(function(req, res){
    res.status(403);

    //Respond with html page
    if (req.accepts('html')) {
      res.render('error', {ErrorCode:403,ErrorDesc:"Forbidden." });
      return;
    }


    //Default to plain-text. send()
    res.type('txt').send('403 Forbidden');
});

app.use(function(req, res){
    res.status(500);

    //Respond with html page
    if (req.accepts('html')) {
      res.render('error', {ErrorCode:500,ErrorDesc:"There was an Internal Server Error...sorry :(" });
      return;
    }

    //Default to plain-text. send()
    res.type('txt').send('500 Internal Server Error');
});
