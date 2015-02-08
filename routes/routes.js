module.exports = function (app,routes) {

  var admin = require('./admin');
  var employee = require('./employee');
  var beacon = require('./beacon');

  // WebService
  app.get('/ws', routes.ws);
  app.get('/ws/:day/:month/:year',routes.wsf);

  // Admin
  app.get('/',admin.login);
  app.get('/admin',admin.index);

  // Employee
  app.get('/admin/employee',employee.read_employee);
  app.post('/admin/employee/create',employee.create_employee);
  app.post('/admin/employee/delete',employee.delete_employee);
  app.post('/admin/employee/update',employee.update_employee);

  // Beacon
  app.get('/admin/beacon',beacon.read_beacon);
  app.post('/admin/beacon/create',beacon.create_beacon);
  app.post('/admin/beacon/delete',beacon.delete_beacon);
  app.post('/admin/beacon/update',beacon.update_beacon);
};