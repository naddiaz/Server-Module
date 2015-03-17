async = require("async");

var Mongoose = require( 'mongoose' );
var Airport     = Mongoose.model( 'Airport' );
var Localization     = Mongoose.model( 'Localization' );
var Person     = Mongoose.model( 'Person' );

exports.create =  function(req, res){
  Airport.findOne({location: req.body.location, name: req.body.name }).select('id_airport').exec(function(err, airport){
    new Localization({
      id_airport: airport.id_airport,
      id_person: req.body.id_person,
      id_beacon: req.body.id_beacon,
      rssi: req.body.rssi,
      date: Date.now()
    }).save( function( err ){
      if(err)
        res.send(err);
      res.send({status: true});
    });
  });
};

exports.history = function(req, res){
  Airport.findOne({location: req.params.location, name: req.params.name }).select('id_airport').exec(function(err, airport){
    var Localizations = Localization.find({id_airport: airport.id_airport,id_person: req.params.id_person});
    var People = Person.findOne({id_airport: airport.id_airport,id_person:req.params.id_person});
    var Airports = Airport.find({});
    var data = {
      loclizations: Localizations.exec.bind(Localizations),
      people: People.exec.bind(People),
      airports: Airports.exec.bind(Airports)
    };
    async.parallel(data,function(err,results){
      if(results.people == null){
        res.render('history',{
          airports: results.airports,
          location: req.params.location,
          name: req.params.name,
          worker_name: null
        });
      }
      else{
        res.render('history',{
          airports: results.airports,
          location: req.params.location,
          name: req.params.name,
          person: results.people
        });
      }
    });
  });
};