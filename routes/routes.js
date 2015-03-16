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

  //Routes Catergories
  /*
    File: routes/categories.js
    categories.list -> async get categories list
  */

  var categories = require('./categories');
  app.get('/airport/:location/:name/categories',categories.index);
  app.post('/categories/list',categories.list);
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
    setCell                 -> set data to cell
    deleteCell              -> remove specific cell
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
  app.post('/scripts/deleteCell',scripts.deleteCell);
  app.post('/scripts/clearGraph',scripts.clearGraph);
  app.post('/scripts/createGraph',scripts.createGraph);
  app.post('/scripts/adjacentsCells',scripts.adjacentsCells);
  app.post('/scripts/nextTask',scripts.nextTask);
  app.post('/scripts/nextEmployee',scripts.nextEmployee);
};
