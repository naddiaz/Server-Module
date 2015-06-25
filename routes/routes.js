module.exports = function (app,dirname) {

// Begin Login

  var login = require('./login');
  app.get('/',login.home);

// End Login

// Begin Installation

  var installation = require('./installation');
  app.get('/index',installation.index);
  app.post('/index',installation.index);

  // Begin Helpers Installation
  app.post('/helper/installation/getInstallationById',installation.getInstallationById);
  // End Helpers Installation

// End Installation

// Begin Map

  var map = require('./map');
  app.get('/installation/:id_installation/map', map.home);

  // Begin Helpers Map
  app.post('/helper/map/saveBeacons', map.saveBeacons);
  app.post('/helper/map/loadBeacons', map.loadBeacons);
  // End Helpers Map
// End Map
};
