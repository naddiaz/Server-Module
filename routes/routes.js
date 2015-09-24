module.exports = function (app,dirname) {

// Begin Login

  var login = require('./login');
  app.get('/',login.home);
  app.post('/register',login.register);

// End Login

// Begin Installation

  var installation = require('./installation');
  app.get('/index',   installation.indexGet);
  app.post('/index',  installation.index);

  // Begin Helpers Installation
  app.post('/helper/installation/getInstallationById',installation.getInstallationById);
  // End Helpers Installation

// End Installation

// Begin Control

  var control = require('./control');
  app.get('/installation/:id_installation/control', control.home);

  // Begin Helpers Control
  app.post('/helper/control/getActivitiesStates',control.getActivitiesStates);
  app.post('/helper/control/employeesStates',control.employeesStates);
  app.post('/helper/control/tasksStates',control.tasksStates);
  app.post('/helper/control/noAssignedActivities',control.noAssignedActivities);
  app.post('/helper/control/activityDetails',control.activityDetails);
  app.post('/helper/control/updateTask',control.updateTask);
  // End Helpers Control
// End Control

// Begin Employees

  var employees = require('./employees');
  app.get('/installation/:id_installation/employees', employees.home);

  // Begin Helpers Employees
  app.post('/helper/employees/save',                     employees.save);
  app.post('/helper/employees/delete',                   employees.delete);
  app.post('/helper/employees/employeesList',            employees.employeesList);
  app.post('/helper/employees/nextEmployeeId',           employees.nextEmployeeId);
  app.post('/helper/employees/updateName',               employees.updateName);
  app.post('/helper/employees/updateLastName',           employees.updateLastName);
  app.post('/helper/employees/updateCategory',           employees.updateCategory);
  app.post('/helper/employees/categoriesList',           employees.categoriesList);
  app.post('/helper/employees/employeesListByCategory',  employees.employeesListByCategory);
  // End Helpers Employees
// End Employees

// Begin Categories

  var categories = require('./categories');
  app.get('/installation/:id_installation/categories', categories.home);

  // Begin Helpers Categories
  app.post('/helper/categories/save',           categories.save);
  app.post('/helper/categories/delete',         categories.delete);
  app.post('/helper/categories/categoriesList', categories.categoriesList);
  app.post('/helper/categories/updateCategory', categories.updateCategory);
  // End Helpers Categories
// End Categories

// Begin Activities

  var activities = require('./activities');
  app.get('/installation/:id_installation/activities', activities.home);
  app.post('/activity/create', activities.create);

  // Begin Helpers Activities
  // End Helpers Activities
// End Activities

// Begin Map

  var map = require('./map');
  app.get('/installation/:id_installation/map', map.home);

  // Begin Helpers Map
  app.post('/helper/map/saveBeacons', map.saveBeacons);
  app.post('/helper/map/loadBeacons', map.loadBeacons);
  app.post('/helper/map/loadEmployees', map.loadEmployees);
  // End Helpers Map
// End Map

// Begin History

  var history = require('./history');
  app.get('/installation/:id_installation/:id_employee', history.home);

  // Begin Helpers History
  app.post('/helper/history/loadTasks', history.loadTasks);
  app.post('/helper/history/loadTasksDetails', history.loadTasksDetails);
  app.post('/helper/history/averageTasks', history.averageTasks);
  // End Helpers History
// End History

  var alert = require('./alerts');
  app.post('/alert/error',alert.error);

  var location = require('./location');
  app.post('/location/send',location.send);


  var chat = require('./chat');
  app.post('/chat/send',chat.send);
  app.post('/chat/update',chat.update);
  app.post('/chat/clear',chat.clear);
};
