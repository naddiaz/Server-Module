var Mongoose = require( 'mongoose' );
var Beacon     = Mongoose.model( 'Beacon' );
var Airport     = Mongoose.model( 'Airport' );

exports.read_beacon =  function(req, res){
  Airport.findOne({location: req.params.location, name: req.params.name }).select('id_airport').exec(function(err, airport){
    Beacon.find({id_airport: airport.id_airport}, function(err, beacons){
      res.render('beacons',{title: 'BLE Tasker', beacons: beacons, location: req.params.location, name: req.params.name, layout: 'layout_admin'});
    });
  });
};

exports.create_beacon =  function(req, res){
  Airport.findOne({location: req.params.location, name: req.params.name }).select('id_airport').exec(function(err, airport){
    new Beacon({
      id_airport: airport.id_airport,
      id_beacon: req.body.id_beacon,
      id_cell: req.body.id_cell_hide,
    }).save( function( err, todo, count ){
      res.redirect( '/admin/config/' + req.params.location + '/' + req.params.name + '/beacons' );
    });
  });
};

exports.update_beacon =  function(req, res){
  Airport.findOne({location: req.params.location, name: req.params.name }).select('id_airport').exec(function(err, airport){
    var conditions = {id_airport: airport.id_airport, id_beacon: req.body.id_beacon_old};
    var query = {};
    if(!emptyString(req.body.id_beacon))
      query.id_beacon = req.body.id_beacon;
    if(!emptyString(req.body.id_cell_edit_hide))
      query.id_cell = req.body.id_cell_edit_hide;
    Beacon.update(conditions, query, function(){
      res.redirect( '/admin/config/' + req.params.location + '/' + req.params.name + '/beacons' );
    });
  });
};

exports.delete_beacon =  function(req, res){
  Airport.findOne({location: req.params.location, name: req.params.name }).select('id_airport').exec(function(err, airport){
    Beacon.remove({id_airport: airport.id_airport, id_beacon: req.body.id_beacon}, function(){
        res.redirect( '/admin/config/' + req.params.location + '/' + req.params.name + '/beacons' );
    });
  });
};



function emptyString(value){
  if(value != "")
    return false;
  return true;
}