let sources_list = [];
let promises = [];
let values_ret;
let amount_ret;

exports.getSources = function(newsapi, callback){
    newsapi.sources({
        language: 'en'
      }).then(sourcesResponse => {

        for(let i = 0; i < sourcesResponse['sources'].length; i++){
            sources_list[i] = sourcesResponse['sources'][i]['name'];
        }

        callback(sources_list);
    });

    return sources_list;
};

exports.getArticles = function(newsapi, callback){
    sources_list.forEach(function(source,i) {
        let fixed_format_source = source.replace(/[()]/g,''); // First delete the parentheses
        fixed_format_source = fixed_format_source.replace(/\s+/g, '-').toLowerCase(); // Then format the string

        promises[i] = newsapi.articles({
            source: fixed_format_source,
            sortBy: 'top'
        });
    });


    Promise.all(promises).then(values => {
        // Use the smallest amount of articles as a baseline for all the other sources
        let min = 15; // No more than 15 articles per source

        values.forEach(function(art,i){ // Find the source with the lowest amount of articles
            let curr = values[i]['articles'];

            if(curr == undefined) {return;}

            if(curr.length < min){
                min = curr.length;
            }
        });

        let amount = []; // let amount = minObj.map((article) => article['title']); -- Gives an object with the titles, not an array?
        for(let i = 0; i < min; i++){
            amount.push(i.toString());
        }

        values_ret = values;
        amount_ret = amount;
        
        callback({
            "values" : values_ret,
            "amount" : amount_ret
        });
    });
    
    return {
        "values" : values_ret,
        "amount" : amount_ret
    };

};