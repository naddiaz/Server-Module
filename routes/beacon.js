var Mongoose = require( 'mongoose' );
var Beacon     = Mongoose.model( 'Beacon' );

exports.read_beacon =  function(req, res){
  Beacon.find( function(err, beacons){
    res.render('beacons',{title: 'BLE Tasker', beacons: beacons, location: req.params.location, name: req.params.name, layout: 'layout_admin'});
  });
};

exports.create_beacon =  function(req, res){
  new Beacon({
    id_beacon: req.body.id_beacon,
    id_cell: req.body.id_cell_hide,
  }).save( function( err, todo, count ){
    res.redirect( '/admin/beacon' );
  });
};

exports.update_beacon =  function(req, res){

  var conditions = {id_beacon: req.body.id_beacon_old};
  var query = {};
  if(!emptyString(req.body.id_beacon))
    query.id_beacon = req.body.id_beacon
  
  Beacon.update(conditions, query, function(){
    res.redirect('/admin/beacon');
  });
};

exports.delete_beacon =  function(req, res){
  Beacon.remove({id_beacon: req.body.id_beacon}, function(){
    res.redirect('/admin/beacon');
  });
};

function emptyString(value){
  if(value != "")
    return false;
  return true;
}