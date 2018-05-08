module.exports = function(app){

    app.use(function(req, res){
        res.status(404);

        //Respond with html page
        if (req.accepts('html')) {
            res.render('error.handlebars', {ErrorCode:404,ErrorDesc:"The page you requested was not found...oops" });
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
};
