
/**
 * Module dependencies.
 */

require('./dbmodels');

var express = require('express')
  , routes = require('./routes')
  , people = require('./routes/people')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('address', 'localhost');
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//Routes
app.get('/', routes.index);
// WS
app.get('/ws', routes.ws);
app.get('/ws/:day/:month/:year',routes.wsf);
//Person
app.get('/people/list', people.list);
app.get('/people/create', people.create);

//Run
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port') + " :: " + app.get('address'));
});
