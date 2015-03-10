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
};
