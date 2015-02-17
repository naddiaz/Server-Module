var Mongoose = require( 'mongoose' );
var Type     = Mongoose.model( 'Type' );
var Airport     = Mongoose.model( 'Airport' );

exports.read_type =  function(req, res){
  Airport.findOne({location: req.params.location, name: req.params.name }).select('id_airport').exec(function(err, airport){
    Type.find({id_airport: airport.id_airport}, function(err, types){
      res.render('types',{title: 'BLE Tasker', types: types, location: req.params.location, name: req.params.name, layout: 'layout_admin'});
    });
  });
};

exports.create_type =  function(req, res){
  Airport.findOne({location: req.params.location, name: req.params.name }).select('id_airport').exec(function(err, airport){
    new Type({
      id_airport: airport.id_airport,
      name: req.body.name
    }).save( function( err ){
      res.redirect( '/admin/config/' + req.params.location + '/' + req.params.name + '/types' );
    });
  });
};

exports.delete_type =  function(req, res){
  Airport.findOne({location: req.params.location, name: req.params.name }).select('id_airport').exec(function(err, airport){
    Type.remove({id_airport: airport.id_airport, name: req.body.name}, function(){
      res.redirect( '/admin/config/' + req.params.location + '/' + req.params.name + '/types' );
    });
  });
};

function emptyString(value){
  if(value != "")
    return false;
  return true;
}