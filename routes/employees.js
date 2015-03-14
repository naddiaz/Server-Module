async = require("async");

var Mongoose = require( 'mongoose' );
var Person     = Mongoose.model( 'Person' );
var Task     = Mongoose.model( 'Task' );
var Airport     = Mongoose.model( 'Airport' );
var Work = Mongoose.model('Work');
var Type = Mongoose.model('Type');

exports.index =  function(req, res){
  Airport.find({location: req.params.location, name: req.params.name }).exec(function(err, airports){
    res.render('employees',
    {
      location: req.params.location,
      name: req.params.name,
      airports: airports
    });
  });
};

exports.list =  function(req, res){
  Airport.findOne({location: req.body.location, name: req.body.name }).select('id_airport').exec(function(err, airport){
    var People = Person.find({id_airport: airport.id_airport}).exec(function(err, people){
      res.send({
        people: people
      });
    });
  });
};