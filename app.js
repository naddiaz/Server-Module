
/**
 * Module dependencies.
 */
 require('./dbmodels.js');

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();
var Mongoose = require('mongoose');


// all environments
app.set('address', process.env.ADDRESS || 'localhost');
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var db = Mongoose.connect('mongodb://' + app.get('address') + '/bletaskerDB');

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/ws', routes.ws);
app.get('/ws/:day/:month/:year',routes.wsf);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port') + " ::: " + app.get('address'));
});
