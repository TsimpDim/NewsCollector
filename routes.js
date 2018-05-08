let express = require('express');
let config = require('./config');
let router = express.Router();
let helperFunctions = require('./helperFunctions');
let NewsAPI = require('newsapi');
let newsapi = new NewsAPI(config.API_KEY);


router.get('/' , function(request,response){
    response.redirect('/sources');
});

router.get('/sources' , function(request,response){

    // Get sources
    helperFunctions.getSources(newsapi, function(val){
        response.render('sources',{'sources_list':val});
    });

});

router.get('/allarticles' , function(request,response){

    // Get sources
    sources_list = helperFunctions.getSources(newsapi);

    // Get articles from sources
    res = helperFunctions.getArticles(newsapi);

    response.render('articles',{'articles':res.values, 'amount': res.amount});
});

router.get('/articles' , function(request,response){
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

module.exports = router;