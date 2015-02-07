module.exports = function (app,routes) {

  var people = require('./people');
  var admin = require('./admin');

  //Routes
  // WS
  app.get('/ws', routes.ws);
  app.get('/ws/:day/:month/:year',routes.wsf);
  //Person
  app.get('/people/list', people.list);
  app.get('/people/create', people.create);

  app.get('/',admin.login);
  app.get('/admin',admin.index);
  app.get('/admin/employee',admin.employee);
  app.post('/admin/employee/create',admin.create_employee);
  app.post('/admin/employee/delete',admin.delete_employee);
  app.post('/admin/employee/update',admin.update_employee);
};