module.exports = function (app,routes) {

  var admin = require('./admin');
  var employee = require('./employee');
  var beacon = require('./beacon');
  var config = require('./config');

  // WebService
  app.get('/ws', routes.ws);
  app.get('/ws/:day/:month/:year',routes.wsf);

  // Admin
  app.get('/',admin.login);
  app.get('/admin',admin.index);

  // Employee
  app.get('/admin/config/:location/:name/employees',employee.read_employee)
  app.post('/admin/config/:location/:name/employee/create',employee.create_employee);
  app.post('/admin/config/:location/:name/employee/delete',employee.delete_employee);
  app.post('/admin/config/:location/:name/employee/update',employee.update_employee);

  // Beacon
  app.get('/admin/config/:location/:name/beacons',beacon.read_beacon);
  app.post('/admin/config/:location/:name/beacon/create',beacon.create_beacon);
  app.post('/admin/config/:location/:name/beacon/delete',beacon.delete_beacon);
  app.post('/admin/config/:location/:name/beacon/update',beacon.update_beacon);

  //Views maps
  app.get('/admin/view/:location/:name',config.view_map)

  //Config
  app.get('/admin/config/:location/:name',config.config_airport)
};