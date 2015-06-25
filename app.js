
/**
 * Module dependencies.
 */

require('./dbmodels');


var express = require('express')
  , http = require('http')
  , path = require('path')
  , i18n = require("i18n");

var app = express();

app.locals._      = require('underscore');
app.locals._.str  = require('underscore.string');
app.locals.moment = require('moment');

i18n.configure({
    locales:['es', 'en'],
    defaultLocale: 'es',
    directory: __dirname + '/locales'
});


// all environments
app.configure(function(){
  app.set('address', 'localhost');
  app.set('port', process.env.PORT || 10000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(i18n.init);
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//Routes
require('./routes/routes')(app,__dirname);

//Run
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port') + " :: " + app.get('address'));
  console.log("Dirname: " + __dirname);
});
