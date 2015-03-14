async = require("async");

var Mongoose = require( 'mongoose' );
var Person     = Mongoose.model( 'Person' );
var Task     = Mongoose.model( 'Task' );
var Airport     = Mongoose.model( 'Airport' );
var Work = Mongoose.model('Work');
var Type = Mongoose.model('Type');

exports.index =  function(req, res){
  Airport.find({}).exec(function(err,airports){
    res.render('map',{airports: airports, location: req.params.location, name: req.params.name}); 
  });
};