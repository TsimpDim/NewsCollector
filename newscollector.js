let express = require('express')
let handlebars = require('express-handlebars').create(
    {
        defaultLayout:'main',
        helpers: {
            title: function(object,n){
                if(object == undefined){
                    return "<ARTICLE NOT FOUND>";
                }
    

                return object[n]['title'];
            },
            image: function(object,n){
                if(object == undefined){
                    return "";
                }
                
                return object[n]['urlToImage'];
            },
            desc: function(object,n){
                if(object == undefined || object[n]['description'] == null){
                    return "";
                }

                return object[n]['description'];
            },
            author: function(object,n){
                if(object == undefined || object[n]['author'] == null){
                    return "";
                }

                return object[n]['author'];
            },
            link: function(object,n){
                if(object == undefined){
                    return "";
                }

                return object[n]['url'];
            },
            date: function(object,n){
                if(object == undefined || object[n]['publishedAt'] == null){
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
            let amount = [];
            values[0]['articles'].forEach(function(art,i){
                amount[i-1] = (i-1).toString();
            });
            
            response.render('articles',{'articles':values, 'amount': amount});
        }).catch(function(err){
            console.log(err);
        });
     

    }
});

app.get('/redir' , function(request,response){
    response.redirect('/'+request.query['choice'])
});



app.listen(app.get('port'),function(){
    console.log("Project is running on http://localhost:"+ app.get('port'));
});