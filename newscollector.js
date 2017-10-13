let express = require('express')
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
                for(let i = 0; i < n; ++i)
                    accum += block.fn(i);
                return accum;
            }
        }
    }
);
let request = require('request');
let NewsAPI = require('newsapi');

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
    response.redirect('/Sources');
});

app.get('/sources' , function(request,response){

    //Get sources
    newsapi.sources({
        language: 'en'
      }).then(sourcesResponse => {
        let sources_list = [];

        for(let i = 0; i < sourcesResponse['sources'].length; i++){
            sources_list[i] = sourcesResponse['sources'][i]['name'];
        }

        response.render('sources',{'sources_list':sources_list});

    });




});

app.get('/all_articles' , function(request,response){ //substituting space with underscore in order to make redirection more efficient.

    //Get sources
    newsapi.sources({
        language: 'en'
      }).then(sourcesResponse => {
        let sources_list = [];

        for(let i = 0; i < sourcesResponse['sources'].length; i++){
            sources_list[i] = sourcesResponse['sources'][i]['name'];
        }

        //Get articles from sources
        let promises = [];
        sources_list.forEach(function(source,i) {
            let fixed_format_source = source.replace(/[()]/g,''); //First delete the parentheses
            fixed_format_source = fixed_format_source.replace(/\s+/g, '-').toLowerCase(); //Then format the string

            promises[i] = newsapi.articles({
                source: fixed_format_source,
                sortBy: 'top'
            });
        });

        Promise.all(promises).then(values => {
            let min = 15; //No more than 15 articles per source

            values.forEach(function(art,i){//Find the source with the lowest amount of articles
                let curr = values[i]['articles'];

                if(curr == undefined) return;

                if(curr.length < min){
                    min = curr.length;
                }
            });

            let amount = []; // let amount = minObj.map((article) => article['title']); -- Gives an object with the titles, not an array?
            for(let i = 0; i < min; i++){
                amount.push(i.toString());
            }

            response.render('articles',{'articles':values, 'amount': amount});//Use the smallest amount of articles as a baseline for all the other sources
        }).catch(function(err){
            console.log(err);
        });
    });
});

app.get('/articles' , function(request,response){
    let source_list = request.query['sources'].split(',');


    if(source_list == 'none'){
        response.redirect('/Sources');
    }else{
        let promises = [];

        //Get articles from sources
        source_list.forEach(function(source,i) {
            let fixed_format_source = source.replace(/[()]/g,''); //First delete the parentheses
            fixed_format_source = fixed_format_source.replace(/\s+/g, '-').toLowerCase(); //Then format the string

            promises[i] = newsapi.articles({
                source: fixed_format_source,
                sortBy: 'top'
            });
        });

        Promise.all(promises).then(values => {
            let min = 15; //No more than 15 articles per source

            values.forEach(function(art,i){//Find the source with the lowest amount of articles
                let curr = values[i]['articles'];

                if(curr == undefined) return;

                if(curr.length < min){
                    min = curr.length;
                }
            });

            let amount = []; // let amount = minObj.map((article) => article['title']); -- Gives an object with the titles, not an array?
            for(let i = 0; i < min; i++){
                amount.push(i.toString());
            }

            response.render('articles',{'articles':values, 'amount': amount});//Use the smallest amount of articles as a baseline for all the other sources
        }).catch(function(err){
            console.log(err);
        });


    }
});

app.get('/redir' , function(request,response){

  //Fix the Open Redirect Vulnerability by sanitizing the request.query['choice'] variable.
  //Use whitelist approach to define which paths are available for redirection to.

  var redirectWhitelist = ["Sources", "all_articles"];//The only paths the application can redirect to.
  var redirectFound = false; //Declare a boolean variable to note whether the user has been redirected or not.

  for(var entry in redirectWhitelist){
    if(request.query['choice']==redirectWhitelist[entry]){ //Check if 'choice' is indeed in our whitelist of allowed paths.
      response.redirect(redirectWhitelist[entry]);
      response.end();
      redirectFound=true; //Set the variable to true. User has been redirected successfully.
      break;
    }
  }


  if(redirectFound == false){ //If user has not been redirected to a whitelisted path, redirect to home directory
    console.log("DEBUG: Redirect path doesn't match the ones defined in the whitelist. Redirecting home..."); //Print to console
    response.redirect('/');
    response.end();
  }
});

app.use(function(req, res, next){
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
      res.render('error', {ErrorCode:404,ErrorDesc:"The page you requested was not found...oops" });
      return;
    }


    // default to plain-text. send()
    res.type('txt').send('404 Not Found');
});

app.use(function(req, res, next){
    res.status(403);

    // respond with html page
    if (req.accepts('html')) {
      res.render('error', {ErrorCode:403,ErrorDesc:"Forbidden" });
      return;
    }


    // default to plain-text. send()
    res.type('txt').send('403 Forbidden');
});

app.use(function(req, res, next){
    res.status(500);

    // respond with html page
    if (req.accepts('html')) {
      res.render('error', {ErrorCode:500,ErrorDesc:"There was an Internal Server Error...sorry :(" });
      return;
    }

    // default to plain-text. send()
    res.type('txt').send('500 Internal Server Error');
});
