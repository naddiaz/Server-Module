module.exports = function (app,routes) {

  var admin = require('./admin');
  var employee = require('./employee');
  var beacon = require('./beacon');
  var task = require('./task');
  var config = require('./config');
  var localization = require('./localization');

  // WebService
  app.get('/ws', routes.ws);
  app.get('/ws/:day/:month/:year',routes.wsf);

  // Admin
  app.get('/',admin.login);
  app.get('/admin',admin.index);

  //Views maps
  app.get('/admin/view/:location/:name',config.view_map);

  //Config
  app.get('/admin/config/:location/:name',config.config_airport);
  app.post('/admin/config/:location/:name/airport/info',config.get_airport);
  app.post('/admin/config/:location/:name/cells/info',config.get_cells);
  app.post('/admin/config/:location/:name/cell/create',config.set_cell);

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


  // Task
  app.post('/admin/config/:location/:name/task/create',task.create_task);

  //Localization
  app.get('/admin/config/localization',localization.read_localization);
  app.post('/receiveLocation',localization.create_localization);



};