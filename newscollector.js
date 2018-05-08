let express = require('express');
let handlebars = require('./handlebars');
let app = express();

app.engine('handlebars',handlebars.engine);
app.disable('x-powered-by');

app.set('view engine','handlebars');
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname +'/public'));

app.listen(app.get('port'),function(){
    console.log("Project is running on http://localhost:"+ app.get('port'));
});

app.use(require('./routes'));
require('./errors')(app);
