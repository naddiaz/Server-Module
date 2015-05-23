module.exports = function (app,routes) {

  //Routes Login
  /*
    File: routes/login.js
    login.index -> views/login.jade
  */

  var login = require('./login');
  app.get('/',login.index);

  //Routes Home
  /*
    File: routes/home.js
    home.index -> views/home.jade
    home.help -> views/help.jade
  */

  var home = require('./home');
  app.get('/index',home.index);
  app.get('/help',home.help);


  //Routes Airport
  /*
    File: routes/airport.js
    airport.index -> views/airport.jade
    airport.tasksStates -> async get tasks
    airport.worksStates -> async get works
  */

  var airport = require('./airports');
  app.get('/airport/:location/:name',airport.index);
  app.post('/airport/tasksStates',airport.tasksStates);
  app.post('/airport/worksStates',airport.worksStates);
  app.post('/airport/employeesStates',airport.employeesStates);

  //Routes Tasks
  /*
    File: routes/tasks.js
    tasks.index -> views/tasks.jade
    tasks.create -> async create new task
  */

  var tasks = require('./tasks');
  app.get('/airport/:location/:name/tasks',tasks.index);
  app.post('/tasks/create',tasks.create);


  //Routes Employees
  /*
    File: routes/employees.js
    employees.index -> views/employees.jade
    employees.list -> async get employees list
  */

  var employees = require('./employees');
  app.get('/airport/:location/:name/employees',employees.index);
  app.post('/employees/list',employees.list);
  app.post('/employees/create',employees.create);
  app.post('/employees/delete',employees.delete);
  app.post('/employees/update/name',employees.updateName);
  app.post('/employees/update/type',employees.updateType);

  app.post('/employee/get/tasks',employees.tasks);

  app.post('/employee/set/task/state',employees.taskState);

  app.post('/hash/confirm',employees.hashCheck);
  app.post('/hash/verify',employees.hashVerify);

  //Routes Catergories
  /*
    File: routes/categories.js
    categories.list -> async get categories list
  */

  var categories = require('./categories');
  app.get('/airport/:location/:name/categories',categories.index);
  app.post('/categories/list',categories.list);
  app.post('/categories/create',categories.create);
  app.post('/categories/delete',categories.delete);
  app.post('/categories/update/name',categories.updateName);

  //Routes Works
  /*
    File: routes/work.js
  */

  var works = require('./works');
  app.post('/works/create',works.create);

  //Routes Map
  /*
    File: routes/map.js
    tasks.index -> views/map.jade
  */

  var map = require('./map');
  app.get('/airport/:location/:name/map',map.index);


  //Routes Localizations
  /*
    File: routes/localizations.js
    localizations.create -> async create new localizations
  */

  var localizations = require('./localizations');
  app.post('/localizations/create',localizations.create);
  app.post('/location/save',localizations.saveLocation);
  app.post('/localizations/history',localizations.history);
  app.post('/localizations/beaconToLatLon',localizations.beaconToLatLon);
  app.get('/airport/:location/:name/history/:id_person',localizations.index);

  //Routes Scripts
  /*
    File: routes/scripts.js
    Only can access by POST method
    employeesByType         -> return employees filtering by specific param type
    employeesByCell         -> return employees in cell
    employeesData           -> return employee data
    employeesByStateAndWork -> return employees for the works order by: first with State, and second with numbers of works asign
    airportData             -> return specific airport
    cellsData               -> return return specific cell
    nextCell                -> find next ID cell
    setCell                 -> create new cell
    setBeacon               -> create new beacon
    deleteCell              -> remove specific cell
    deleteBeacon            -> remove specific beacon
    clearGraph              -> clear all graph data
    createGraph             -> set new cell into graph
    adjacentsCells          -> return adjacents cell to a specific cell
    nextTask                -> find next ID task
    nextEmployee            -> find next ID person
  */

  var scripts = require('./scripts');
  app.post('/scripts/employeesByType',scripts.employeesByType);
  app.post('/scripts/employeesByCell',scripts.employeesByCell);
  app.post('/scripts/employeesData',scripts.employeesData);
  app.post('/scripts/employeesByStateAndWork',scripts.employeesByStateAndWork);
  app.post('/scripts/airportData',scripts.airportData);
  app.post('/scripts/cellsData',scripts.cellsData);
  app.post('/scripts/nextCell',scripts.nextCell);
  app.post('/scripts/setCell',scripts.setCell);
  app.post('/scripts/setBeacon',scripts.setBeacon);
  app.post('/scripts/deleteCell',scripts.deleteCell);
  app.post('/scripts/deleteBeacon',scripts.deleteBeacon);
  app.post('/scripts/clearGraph',scripts.clearGraph);
  app.post('/scripts/createGraph',scripts.createGraph);
  app.post('/scripts/adjacentsCells',scripts.adjacentsCells);
  app.post('/scripts/nextTask',scripts.nextTask);
  app.post('/scripts/nextEmployee',scripts.nextEmployee);

  //Routes GCM
  /*
    File: routes/gcm.js
    gcm.registrationGCM -> create new entry with id registration ID send by app
  */

  var gcm = require('./gcm');
  app.post('/gcm/registration',gcm.registrationGCM);
  app.post('/gcm/registration/unlink',gcm.unlinkGCM);
  app.post('/gcm/create',gcm.create);


  app.get('/gcm/test',gcm.sendNotificationTest);

  var test = require('./testCrypt');
  app.get('/test/crypt/:id_airport/:id_person/:message',test.index);
};
