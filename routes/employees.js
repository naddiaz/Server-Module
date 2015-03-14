async = require("async");

var Mongoose = require( 'mongoose' );
var Person     = Mongoose.model( 'Person' );
var Task     = Mongoose.model( 'Task' );
var Airport     = Mongoose.model( 'Airport' );
var Work = Mongoose.model('Work');
var Type = Mongoose.model('Type');

exports.index =  function(req, res){
  Airport.findOne({location: req.params.location, name: req.params.name }).select('id_airport').exec(function(err, airport){
    var People = Person.find({id_airport: airport.id_airport});
    var Airports = Airport.find({});

    var data = {
      people: People.exec.bind(People),
      airports: Airports.exec.bind(Airports)
    };

    async.parallel(data,function(err,results){
      res.render('employees',
      {
        location: req.params.location,
        name: req.params.name,
        airports: results.airports,
        people: results.people
      });
    });
  });
};