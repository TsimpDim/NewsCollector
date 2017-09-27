let express = require('express')
let handlebars = require('express-handlebars').create(
    {
        defaultLayout:'main',
        helpers: {
            title: function(object){
                if(object == undefined){
                    return "<ARTICLE NOT FOUND>";
                }
                
                return object[0]['title'];
            },
            image: function(object){
                if(object == undefined){
                    return "";
                }
                
                return object[0]['urlToImage'];
            },
            desc: function(object){
                if(object == undefined || object[0]['description'] == null){
                    return "";
                }

                return object[0]['description'];
            },
            author: function(object){
                if(object == undefined || object[0]['author'] == null){
                    return "";
                }

                return object[0]['author'];
            },
            link: function(object){
                if(object == undefined){
                    return "";
                }

                return object[0]['url'];
            },
            date: function(object){
                if(object == undefined || object[0]['publishedAt'] == null){
                    return "";
                }

                return object[0]['publishedAt'].replace(/\T(.*)/g,'');
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

app.get('/all%20articles' , function(request,response){
    response.render('articles');

    
    newsapi.articles({
        source: 'associated-press', // required 
        sortBy: 'top' // optional 
      }).then(articlesResponse => {
        console.log(articlesResponse);
      });

});

app.get('/articles' , function(request,response){
    let source_list = request.query['sources'].split(',');
    let promises = [];
    

    if(source_list == 'none'){
        response.redirect('/Sources');
    }else{
        
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
            response.render('articles',{'articles':values});
        });
     

    }
});

app.get('/redir' , function(request,response){
    response.redirect('/'+request.query['choice'])
});



app.listen(app.get('port'),function(){
    console.log("Project is running on http://localhost:"+ app.get('port'));
});