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
  */

  var airport = require('./airports');
  app.get('/airport/:location/:name',airport.index);

  //Routes Tasks
  /*
    File: routes/tasks.js
    tasks.index -> views/tasks.jade
  */

  var tasks = require('./tasks');
  app.get('/airport/:location/:name/tasks',tasks.index);
  app.post('/tasks/create',tasks.create);



  //Routes Works
  /*
    File: routes/work.js
  */

  var work = require('./work');
  app.post('/work/create',work.create);


  //Routes Scripts
  /*
    File: routes/scripts.js
    Only can access by POST method
    employeesByType -> return employees filtering by specific param type
  */

  var scripts = require('./scripts');
  app.post('/scripts/employeesByType',scripts.employeesByType);
  app.post('/scripts/airportData',scripts.airportData);
  app.post('/scripts/cellsData',scripts.cellsData);
  app.post('/scripts/nextCell',scripts.nextCell);
  app.post('/scripts/setCell',scripts.setCell);
  app.post('/scripts/deleteCell',scripts.deleteCell);
  app.post('/scripts/clearGraph',scripts.clearGraph);
  app.post('/scripts/setCellGraph',scripts.setCellGraph);
  app.post('/scripts/adjacentsCells',scripts.adjacentsCells);
};
