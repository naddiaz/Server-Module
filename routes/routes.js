module.exports = function (app,routes) {

  var admin = require('./admin');
  var employee = require('./employee');
  var beacon = require('./beacon');
  var task = require('./task');
  var work = require('./work');
  var config = require('./config');
  var localization = require('./localization');
  var types = require('./types');

  // Admin
  app.get('/',admin.login);
  app.get('/admin',admin.index);

  //Views maps
  app.get('/admin/view/:location/:name',config.view_map);

  //Config
  app.get('/admin/config/:location/:name',config.index);
  app.post('/admin/config/:location/:name/airport/info',config.get_airport);
  app.post('/admin/config/:location/:name/cells/info',config.get_cells);
  app.post('/admin/config/:location/:name/cell/next',config.get_next_cell_id);
  app.post('/admin/config/:location/:name/cell/create',config.set_cell);
  app.post('/admin/config/:location/:name/cell/delete',config.delete_cell);
  app.post('/admin/config/:location/:name/cells/adjacents',config.get_adjacents_cells);
  app.post('/admin/config/:location/:name/graph/clear',config.graph_clear);
  app.post('/admin/config/:location/:name/graph/create',config.graph_cell);

  // Employee
  app.get('/admin/config/:location/:name/employees',employee.read_employee)

  app.post('/admin/config/:location/:name/employee/filter',employee.filter_type);
  app.post('/admin/config/:location/:name/employee/create',employee.create_employee);
  app.post('/admin/config/:location/:name/employee/delete',employee.delete_employee);
  app.post('/admin/config/:location/:name/employee/update',employee.update_employee);

  // Beacon
  app.get('/admin/config/:location/:name/beacons',beacon.read_beacon);
  app.post('/admin/config/:location/:name/beacon/create',beacon.create_beacon);
  app.post('/admin/config/:location/:name/beacon/delete',beacon.delete_beacon);
  app.post('/admin/config/:location/:name/beacon/update',beacon.update_beacon);


  // Task
  app.get('/admin/config/:location/:name/tasks',task.read_tasks);
  app.post('/admin/config/:location/:name/task/create',task.create_task);

  //Work
  app.post('/admin/config/:location/:name/work/create',work.create_work);

  //Localization
  app.get('/admin/config/localization',localization.read_localization);
  app.post('/admin/config/:location/:name/localization/employeesByCell',localization.get_employees_by_cell);
  app.post('/receiveLocation',localization.create_localization);

  //Types
  app.get('/admin/config/:location/:name/types',types.read_type);
  app.post('/admin/config/:location/:name/type/create',types.create_type);
  app.post('/admin/config/:location/:name/type/delete',types.delete_type);


};
