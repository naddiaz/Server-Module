module.exports = function (app,routes) {

  var people = require('./people');
  var login = require('./login');

  //Routes
  // WS
  app.get('/ws', routes.ws);
  app.get('/ws/:day/:month/:year',routes.wsf);
  //Person
  app.get('/people/list', people.list);
  app.get('/people/create', people.create);

  app.get('/',login.login);
  app.get('/admin',login.index);
};