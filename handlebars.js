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

module.exports = handlebars;